# /// script
# requires-python = ">=3.11"
# dependencies = ["pandas", "matplotlib"]
# ///
"""Carrera de barras de los mayores clústeres de cómputo para IA (FLOP/s de 16 bits).

Escribe out/race.mp4; con --publicar, además la versión web y el póster en public/video/.
Necesita ffmpeg y la fuente Nimbus Sans. Los textos del vídeo están en inglés.
"""
import argparse
import os
import shutil
import subprocess
from multiprocessing import Pool
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).parent
TODAY = pd.Timestamp("2026-10-24")
TOPN = 12
FPS = 30
W, H, DPI = 19.2, 10.8, 100
# segundos de vídeo por año de calendario, interpolados entre anclas
PACE = [("2007-06-01", 2.0), ("2016-06-01", 2.6), ("2019-01-01", 4.0), ("2023-01-01", 5.5), ("2029-01-01", 6.0)]
SLOWMO = 1.7  # ralentización alrededor de cada hito
SLOWMO_DAYS = 75
HOLD_END_S = 4
RAMP_DAYS = 150  # los cambios de capacidad se reparten linealmente en este tiempo de calendario
Y_EASE = 0.2
SWAP_MARGIN = 0.03

BG, INK, INK2, MUTED, GRID = "#121211", "#f4f3ee", "#c3c2b7", "#7d7c76", "#2a2a28"
COLORS = {  # paleta categórica para fondo oscuro
    "OpenAI / Microsoft": "#3987e5",
    "xAI": "#d95926",
    "Google": "#199e70",
    "Amazon / Anthropic": "#c98500",
    "Meta": "#d55181",
    "Public HPC": "#9085e9",
    "China": "#e66767",
    "Other": "#6f6e69",
}
MILESTONES = [
    ("2007-06-23", "CUDA 1.0: GPUs become programmable for general compute"),
    ("2008-11-17", "TSUBAME 1.2: first GPU system on the TOP500"),
    ("2012-09-30", "AlexNet wins ImageNet — trained on 2 gaming GPUs"),
    ("2016-03-09", "AlphaGo beats Lee Sedol"),
    ("2017-05-10", "NVIDIA V100: first GPU with tensor cores\n“Attention Is All You Need” follows in June"),
    ("2017-10-18", "AlphaGo Zero learns Go from self-play alone"),
    ("2019-02-14", "GPT-2 — “too dangerous to release”"),
    ("2020-05-14", "NVIDIA A100 launches\nGPT-3 follows — trained on a 10k V100 Azure cluster"),
    ("2022-03-22", "H100 announced\nChinchilla: scale data with model size"),
    ("2022-10-07", "US export controls cut China off from A100/H100"),
    ("2022-11-30", "ChatGPT launches"),
    ("2023-03-14", "GPT-4 — trained on ~25k A100s"),
    ("2024-03-12", "Meta's twin 24k H100 clusters train Llama 3\nNVIDIA unveils Blackwell (B200/GB200)"),
    ("2024-09-02", "xAI Colossus: 100k H100s, built in 122 days"),
    ("2025-01-21", "$500B Stargate announced for OpenAI\nDeepSeek-R1 — NVIDIA loses 17% in a day"),
    ("2025-07-09", "Grok 4, trained on Colossus"),
    ("2025-10-29", "Project Rainier online: ~500k Trainium2 for Anthropic"),
    ("2026-05-06", "Anthropic leases all of Colossus 1 from xAI"),
    ("2026-06-15", "Colossus 2 passes 1M H100-equivalents (~1 GW)"),
    ("2026-10-24", "Today — everything after this is announced plans"),
    ("2028-01-01", "Multi-gigawatt era: Meta Hyperion, Fairwater, Stargate"),
]
MILESTONE_S = 4.0
MILESTONE_DAYS = 240  # el rótulo también se retira cuando la fecha lo deja atrás

plt.rcParams.update({"font.family": "Nimbus Sans", "hatch.color": BG, "hatch.linewidth": 2.0})


def build_timeline():
    """Integrate a smooth seconds-per-day curve so frame dates never jump in speed."""
    days = pd.date_range(PACE[0][0], PACE[-1][0], freq="D")
    x = days.values.astype("datetime64[D]").astype(float)
    ax = np.array([np.datetime64(d, "D").astype(float) for d, _ in PACE])
    spd = np.interp(x, ax, [p for _, p in PACE]) / 365.25
    for md, _ in MILESTONES:
        m = np.datetime64(md, "D").astype(float)
        spd *= 1 + (SLOWMO - 1) * np.exp(-(((x - m) / SLOWMO_DAYS) ** 2))
    t = np.concatenate([[0], np.cumsum(spd)])[:-1]  # segundo de vídeo de cada día
    ft = np.arange(0, t[-1], 1 / FPS)
    dates = list(pd.to_datetime(np.interp(ft, t, x), unit="D"))
    dates += [dates[-1]] * (HOLD_END_S * FPS)
    return dates


def fmt_flops(v):
    for unit, s in [("ZFLOP/s", 1e21), ("EFLOP/s", 1e18), ("PFLOP/s", 1e15), ("TFLOP/s", 1e12)]:
        if v >= s:
            x = v / s
            return f"{x:.0f} {unit}" if x >= 100 else f"{x:.1f} {unit}" if x >= 10 else f"{x:.2f} {unit}"
    return f"{v:.0f} FLOP/s"


def fmt_h100(h):
    if h >= 1e6:
        return f"{h / 1e6:.1f}M H100e"
    if h >= 1e3:
        return f"{h / 1e3:.0f}k H100e"
    return f"{h:.0f} H100e" if h >= 10 else f"{h:.1f} H100e" if h >= 1 else f"{h:.2f} H100e"


def compute_states(df, dates):
    ents = df.groupby("entity").agg(label=("label", "first"), group=("group", "last")).reset_index()
    idx = {e: i for i, e in enumerate(ents.entity)}
    n = len(ents)

    # escalón diario por entidad y media móvil hacia atrás: rampas lineales de RAMP_DAYS
    day0 = np.datetime64(PACE[0][0], "D") - np.timedelta64(RAMP_DAYS, "D")
    nd = int((np.datetime64(PACE[-1][0], "D") - day0).astype(int)) + 1
    raw = np.zeros((nd, n))
    rowid = np.full((nd, n), -1, dtype=np.int32)  # fila (etiqueta y grupo) vigente cada día
    projd = np.full(n, nd)  # primer día con valor procedente de un intervalo proyectado
    df = df.sort_values("flops16").reset_index(drop=True)  # si se solapan, gana la fila mayor
    for r in df.itertuples():
        j = idx[r.entity]
        a = max(int((np.datetime64(r.start.date(), "D") - day0).astype(int)), 0)
        b = min(int((np.datetime64(r.end.date(), "D") - day0).astype(int)), nd)
        if b > a:
            raw[a:b, j] = r.flops16
            rowid[a:b, j] = r.Index
            if r.start > TODAY:
                projd[j] = min(projd[j], a)
    # la barra conserva la última etiqueta al salir y la primera al entrar
    pos = np.where(rowid >= 0, np.arange(nd)[:, None], 0)
    np.maximum.accumulate(pos, axis=0, out=pos)
    rowid = np.take_along_axis(rowid, pos, axis=0)
    first = rowid[np.argmax(rowid >= 0, axis=0), np.arange(n)]
    rowid = np.where(rowid >= 0, rowid, first)
    labels, groups = df.label.to_numpy(), df.group.to_numpy()
    cs = np.vstack([np.zeros((1, n)), np.cumsum(raw, axis=0)])
    lo = np.maximum(np.arange(nd) - RAMP_DAYS + 1, 0)
    smooth = (cs[np.arange(nd) + 1] - cs[lo]) / RAMP_DAYS

    y = np.full(n, TOPN + 1.0)
    prev_rank = np.full(n, TOPN + 1.0)
    xmax = None
    leader_hist, states = [], []
    for d in dates:
        k = min(int((np.datetime64(d, "D") - day0).astype(int)), nd - 1)
        v = smooth[k]
        on = v > 0
        # histéresis: para adelantar hay que superar en ~SWAP_MARGIN por puesto
        score = np.log(np.maximum(v, 1)) - SWAP_MARGIN * prev_rank
        order = np.lexsort((np.arange(n), -score))
        rank = np.full(n, TOPN + 1.0)
        live = order[on[order]][:TOPN]
        rank[live] = np.arange(len(live))
        prev_rank = rank
        y += (rank - y) * Y_EASE
        vis = np.where((y < TOPN + 0.6) & on)[0]
        vals = v[vis]
        tmax = vals.max() if len(vals) else 1
        xmax = tmax  # los valores ya van en rampa: el eje se mueve suave
        leader_hist.append((d, raw[k].max()))
        rid = rowid[k, vis]
        states.append(dict(date=d, ids=vis, y=y[vis].copy(), v=vals, proj=(projd[vis] <= k), xmax=xmax,
                           labels=labels[rid], groups=groups[rid]))
    return ents, states, leader_hist


def draw(args):
    i, s, ents, leader_hist, frames_dir, ms_frames = args
    fig = plt.figure(figsize=(W, H), dpi=DPI, facecolor=BG)
    d = s["date"]

    fig.text(0.035, 0.925, "The largest AI compute clusters", color=INK, fontsize=34, weight="bold")
    fig.text(0.035, 0.885, "Peak dense 16-bit FLOP/s per single cluster  ·  top 12  ·  data: Epoch AI + public sources",
             color=MUTED, fontsize=16)
    fig.text(0.965, 0.89, f"{d.year}", color=INK, fontsize=72, weight="bold", ha="right")
    fig.text(0.965, 0.855, d.strftime("%B"), color=INK2, fontsize=20, ha="right")
    if d > TODAY:
        fig.text(0.965, 0.82, "PROJECTED  ·  announced build-outs", color="#c98500", fontsize=15,
                 ha="right", weight="bold")

    ax = fig.add_axes([0.235, 0.07, 0.465, 0.75], facecolor=BG)
    xmax = s["xmax"] * 1.02
    ax.set_xlim(0, xmax)
    ax.set_ylim(TOPN - 0.4, -0.6)
    for sp in ax.spines.values():
        sp.set_visible(False)
    ax.tick_params(axis="y", left=False, labelleft=False)
    ticks = nice_ticks(xmax)
    ax.set_xticks(ticks)
    ax.set_xticklabels([fmt_flops(t) if t else "0" for t in ticks], color=MUTED, fontsize=12)
    ax.tick_params(axis="x", length=0, top=True, bottom=False, labeltop=True, labelbottom=False)
    ax.grid(axis="x", color=GRID, lw=1)
    ax.set_axisbelow(True)

    h = 0.78
    for yy, v, pr, label, grp in zip(s["y"], s["v"], s["proj"], s["labels"], s["groups"]):
        c = COLORS.get(grp, COLORS["Other"])
        fade = float(np.clip(TOPN - 0.5 - yy, 0, 1))  # las barras que entran o salen se desvanecen abajo
        if fade <= 0:
            continue
        ax.barh(yy, v, height=h, color=c, alpha=(0.6 if pr else 1.0) * fade, hatch="//" if pr else None, lw=0)
        ax.text(-xmax * 0.012, yy, shorten(label), ha="right", va="center", color=INK, fontsize=16,
                alpha=fade, clip_on=False)
        ax.text(v + xmax * 0.01, yy - 0.12, fmt_flops(v), ha="left", va="center", color=INK, fontsize=15,
                weight="bold", alpha=fade, clip_on=False)
        ax.text(v + xmax * 0.01, yy + 0.22, fmt_h100(v / 989.5e12), ha="left", va="center", color=MUTED,
                fontsize=11.5, alpha=fade, clip_on=False)

    # leyenda
    for k, (g, c) in enumerate(COLORS.items()):
        lx, ly = 0.785 + (k // 4) * 0.11, 0.58 - (k % 4) * 0.032
        fig.patches.append(plt.Rectangle((lx, ly), 0.010, 0.018, color=c, transform=fig.transFigure))
        fig.text(lx + 0.015, ly + 0.002, g, color=INK2, fontsize=12.5)

    # recuadro: el n.º 1 a lo largo del tiempo, escala log
    ix = fig.add_axes([0.80, 0.10, 0.17, 0.30], facecolor=BG)
    hist = [(t, v) for t, v in leader_hist[: i + 1] if v > 0]
    if hist:
        t, v = zip(*hist)
        t = np.array(t, dtype="datetime64[ns]")
        v = np.array(v)
        past = t <= np.datetime64(TODAY)
        ix.plot(t[past], v[past], color=INK, lw=2, drawstyle="steps-post")
        if (~past).any():
            k = max(past.sum() - 1, 0)
            ix.plot(t[k:], v[k:], color="#c98500", lw=2, ls=(0, (2, 2)), drawstyle="steps-post")
        ix.plot(t[-1], v[-1], "o", color=INK, ms=6)
    ix.set_yscale("log")
    ix.set_ylim(1e13, 1e22)
    ix.set_xlim(np.datetime64("2007-01-01"), np.datetime64("2029-01-01"))
    ix.set_yticks([1e13, 1e15, 1e18, 1e21])
    ix.set_yticklabels(["10 TFLOP/s", "1 PFLOP/s", "1 EFLOP/s", "1 ZFLOP/s"], color=MUTED, fontsize=10)
    ix.set_xticks([np.datetime64(f"{y}-01-01") for y in (2010, 2015, 2020, 2025)])
    ix.set_xticklabels(["2010", "2015", "2020", "2025"], color=MUTED, fontsize=10)
    ix.tick_params(length=0)
    ix.grid(color=GRID, lw=0.8)
    for sp in ix.spines.values():
        sp.set_visible(False)
    ix.set_title("#1 cluster, log scale", color=INK2, fontsize=12, loc="left")

    # rótulo de hitos
    spans = [ms_frames.get(md) for md, _ in MILESTONES] + [None]
    for k, (md, txt) in enumerate(MILESTONES):
        if spans[k] is None:
            continue
        f0, f1 = spans[k]
        if spans[k + 1] is not None:
            f1 = min(f1, spans[k + 1][0])
        if f0 <= i < f1:
            a = min(1, (i - f0) / 8, (f1 - i) / 8)
            when = pd.Timestamp(md).strftime("%b %Y").upper()
            fig.text(0.965, 0.725, when, color="#c98500", alpha=a, fontsize=12, ha="right", weight="bold")
            fig.text(0.965, 0.69, txt, color=INK, alpha=a, fontsize=15, ha="right", va="top", linespacing=1.4,
                     bbox=dict(facecolor="#1f1f1d", edgecolor=GRID, boxstyle="round,pad=0.6", alpha=a))

    fig.savefig(frames_dir / f"{i:05d}.png", facecolor=BG)
    plt.close(fig)


def nice_ticks(xmax):
    raw = xmax / 4
    mag = 10 ** np.floor(np.log10(raw))
    step = min((m * mag for m in (1, 2, 2.5, 5, 10) if m * mag >= raw), default=raw)
    return list(np.arange(0, xmax, step))


def shorten(s, n=34):
    return s if len(s) <= n else s[: n - 1] + "…"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", type=int, nargs="*", help="only render these frame indexes")
    ap.add_argument("--step", type=int, default=1, help="render every Nth frame (draft)")
    ap.add_argument("--publicar", action="store_true", help="also write the web copy + poster to public/video/")
    a = ap.parse_args()

    df = pd.read_csv(ROOT / "data/clusters.csv", parse_dates=["start", "end"])
    dates = build_timeline()
    ents, states, leader = compute_states(df, dates)
    ms_frames = {}
    for md, _ in MILESTONES:
        ts = pd.Timestamp(md)
        f0 = next((k for k, d in enumerate(dates) if d >= ts), None)
        f_cal = next((k for k, d in enumerate(dates) if d >= ts + pd.Timedelta(days=MILESTONE_DAYS)), len(dates))
        ms_frames[md] = None if f0 is None else (f0, min(f0 + MILESTONE_S * FPS, max(f_cal, f0 + 2.5 * FPS)))

    frames_dir = ROOT / "out/frames"
    shutil.rmtree(frames_dir, ignore_errors=True)
    frames_dir.mkdir(parents=True)
    todo = [k for k in a.preview if k < len(states)] if a.preview else range(0, len(states), a.step)
    jobs = [(i, states[i], ents, leader, frames_dir, ms_frames) for i in todo]
    print(f"{len(dates)} frames total ({len(dates) / FPS:.0f}s), rendering {len(jobs)}")
    with Pool(os.cpu_count()) as p:
        p.map(draw, jobs, chunksize=8)
    if a.preview:
        return
    # renumera para ffmpeg cuando se usa --step
    for k, f in enumerate(sorted(frames_dir.glob("*.png"))):
        f.rename(frames_dir / f"f{k:05d}.png")
    out = ROOT / "out/race.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS // a.step),
                    "-i", str(frames_dir / "f%05d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p",
                    "-crf", "18", str(out)], check=True)
    print(out)
    if a.publicar:
        publicar(out, frames_dir)


def publicar(out, frames_dir):
    """Versión web (Cloudflare Pages limita a 25 MiB por fichero) y póster con el último fotograma."""
    dest = ROOT.parent.parent / "public/video"
    dest.mkdir(parents=True, exist_ok=True)
    web = dest / "clusters-ia.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-c:v", "libx264", "-preset", "slow",
                    "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(web)], check=True)
    last = sorted(frames_dir.glob("f*.png"))[-1]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(last), "-vf", "scale=1280:-1",
                    "-q:v", "4", str(dest / "clusters-ia.jpg")], check=True)
    mib = web.stat().st_size / 2**20
    assert mib < 25, f"{web} pesa {mib:.1f} MiB"
    print(web, f"{mib:.1f} MiB")


if __name__ == "__main__":
    main()

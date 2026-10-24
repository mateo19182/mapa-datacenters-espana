# /// script
# requires-python = ">=3.11"
# dependencies = ["pandas"]
# ///
"""Une los superordenadores de IA de Epoch AI, las series de sus centros de datos frontera y
las correcciones de data/research_*.csv en una tabla de intervalos.

Salida: data/clusters.csv (entity, label, group, chips, start, end, flops16, h100e). Cada fila es
un intervalo de valor constante; una entidad puede tener varios. Criterios en research/clusters-ia.md.
"""
import re
from pathlib import Path

import pandas as pd

D = Path(__file__).parent / "data"
CUTOVER = pd.Timestamp("2025-08-01")  # los superordenadores acaban en 2025-07; después, emplazamientos
END = pd.Timestamp("2029-01-01")
H100_16BIT = 989.5e12  # BF16 denso

GROUPS = [  # gana la primera coincidencia sobre propietario + usuarios + nombre
    ("xAI", r"\bxai\b|spacexai|colossus"),
    ("OpenAI / Microsoft", r"openai|microsoft|stargate|fairwater|azure"),
    ("Google", r"google"),
    ("Meta", r"\bmeta\b|facebook"),
    ("Amazon / Anthropic", r"amazon|anthropic|\baws\b"),
    ("China", r"china|chinese|alibaba|huawei|bytedance|tencent|baidu|vnet|tianhe|nebulae|envision"),
    ("Public HPC", r"department of energy|national lab|\bnl\b|euro ?hpc|genci|cscs|eth domain|jülich|julich|"
                   r"riken|aist|tsubame|gsic|university|supercomput|ncsa|oak ridge|livermore|argonne|"
                   r"government|cea|cineca|barcelona|ukri|research and innovation|jamstec|marine-earth"),
]

# Sistemas GPU del TOP500 que faltan en Epoch. Antes de Pascal no hay FP16 rápido: se usa el pico FP32.
MANUAL = [
    # etiqueta, grupo, inicio, chips, FLOP/s de 16 bits por chip
    ("Nebulae (NSCS Shenzhen)", "China", "2010-06-01", 4640, 1.03e12),
    ("TSUBAME 2.0", "Public HPC", "2010-11-01", 4224, 1.03e12),
    ("ORNL Titan", "Public HPC", "2012-11-01", 18688, 3.95e12),
    ("NCSA Blue Waters", "Public HPC", "2013-03-01", 4228, 3.95e12),
    ("ORNL Summit", "Public HPC", "2018-06-01", 27648, 125e12),
]

HYPERSCALERS = {"xAI", "OpenAI / Microsoft", "Google", "Meta", "Amazon / Anthropic"}
DC_COVERED_OWNERS = r"coreweave|oracle|nebius|crusoe"


# mantiene la barra al pasar de superordenador a emplazamiento
SAME_SITE = {"xAI Colossus Memphis": "Colossus 1", "OpenAI/Microsoft Goodyear Arizona": "Microsoft Goodyear"}


def base_name(name):
    name = re.sub(r"\s*Phase \d+\w*", "", name.strip('"')).strip()
    return SAME_SITE.get(name, name)


def group_of(*texts):
    s = " ".join(str(t) for t in texts if isinstance(t, str)).lower()
    for g, pat in GROUPS:
        if re.search(pat, s):
            return g
    return "Other"


def strip_tags(s):
    return re.sub(r"\s*#\w+", "", s) if isinstance(s, str) else s


def supercomputers():
    d = pd.read_csv(D / "ai_supercomputers.csv", parse_dates=["First Operational Date"])
    d = d.dropna(subset=["First Operational Date"])
    d = d[~d["Chip type (primary)"].fillna("").str.contains("TPU v1")]  # chip de inferencia int8
    # 16 bits; si no, FP32 (GPU antiguas sin FP16 rápido); si no, el máximo
    num = lambda c: pd.to_numeric(d[c], errors="coerce")
    d["flops16"] = num("16-bit OP/s").fillna(num("32-bit OP/s")).fillna(num("Max OP/s"))
    d = d.dropna(subset=["flops16"])
    d = d[d.flops16 > 0]
    start = dict(zip(d.Name, d["First Operational Date"]))

    rows, anon = [], 0
    for _, r in d.sort_values("First Operational Date").iterrows():
        name = base_name(r.Name)
        if name.startswith("Anonymized"):
            anon += 1
            name = f"Undisclosed Chinese system #{anon}"
        g = group_of(r.Owner, r.Users, r.Name, r.Country if r.Country == "China" else "")
        end = start.get(r["Superseded by"], END)
        # tras el corte, las series de emplazamientos cubren a hyperscalers y neoclouds; los que
        # continúan en una serie conservan su último valor como suelo (cambiar de fuente no borra GPU)
        if name not in SAME_SITE.values() and (g in HYPERSCALERS or re.search(DC_COVERED_OWNERS, str(r.Owner).lower())):
            end = min(end, CUTOVER)
        if end <= r["First Operational Date"]:
            continue
        rows.append(dict(entity=name, label=name, group=g, chips=r["Chip type (primary)"],
                         start=r["First Operational Date"], end=end, flops16=r.flops16))
    for label, g, s, n, per in MANUAL:
        rows.append(dict(entity=label, label=label, group=g, chips=None,
                         start=pd.Timestamp(s), end=END, flops16=n * per))
    return pd.DataFrame(rows)


def data_centers():
    meta = pd.read_csv(D / "data_centers.csv").set_index("Name")
    t = pd.read_csv(D / "data_center_timelines.csv", parse_dates=["Date"])
    t = t.dropna(subset=["H100 equivalents"]).sort_values("Date")
    rows = []
    for name, g in t.groupby("Data center"):
        m = meta.loc[name] if name in meta.index else pd.Series(dtype=object)
        owner, users = strip_tags(m.get("Owner")), strip_tags(m.get("Users"))
        grp = group_of(users, owner, name)
        g = g[g.Date <= END]
        dates, vals = list(g.Date), list(g["H100 equivalents"])
        for i, (s, v) in enumerate(zip(dates, vals)):
            e = dates[i + 1] if i + 1 < len(dates) else END
            s2, e2 = max(s, CUTOVER), e
            if v <= 0 or e2 <= s2:
                continue
            rows.append(dict(entity=name, label=name, group=grp, chips=m.get("Current chip types"),
                             start=s2, end=e2, flops16=v * H100_16BIT))
    return pd.DataFrame(rows)


def apply_research(df):
    """Aplica data/research_*.csv (add, rename, regroup, remove, merge, redate) por `entity`."""
    files = sorted(D.glob("research_*.csv"))
    if not files:
        return df
    r = pd.concat([pd.read_csv(f, parse_dates=["start", "end"]) for f in files], ignore_index=True)
    r = r[r.confidence.isin(["high", "medium"])]
    r = r[r.action.isin(["add", "rename", "regroup", "remove", "merge", "redate"])]  # note y excluded solo documentan
    # redate antes de que nada cambie claves; merge al final
    r["_o"] = r.action.map({"redate": 0, "remove": 1, "rename": 2, "regroup": 2, "merge": 3, "add": 4})
    r = r.sort_values("_o", kind="stable")
    for x in r[r.action != "add"].itertuples():
        m = df.entity == x.match_key
        if not m.any():
            print(f"  ! no match for {x.action} {x.match_key!r}")
            continue
        if x.action == "remove":
            df = df[~m]
            continue
        if x.action == "redate":  # corrige primer inicio, último fin o valor
            if pd.notna(x.start):
                df.loc[m & (df.start == df[m].start.min()), "start"] = x.start
            if pd.notna(x.end):
                df.loc[m & (df.end == df[m].end.max()), "end"] = x.end
            if pd.notna(x.flops16) and m.sum() == 1:
                df.loc[m, "flops16"] = float(x.flops16)
            continue
        if pd.notna(x.start):  # el cambio rige desde una fecha (p. ej., un arrendamiento)
            a = df[m & (df.start < x.start) & (df.end > x.start)]
            head, tail = a.copy(), a.copy()
            head["end"], tail["start"] = x.start, x.start
            df = pd.concat([df.drop(a.index), head, tail], ignore_index=True)
            m = (df.entity == x.match_key) & (df.start >= x.start)
        if x.action in ("rename", "merge") and isinstance(x.label, str):
            df.loc[m, "label"] = x.label
            if x.action == "merge":
                df.loc[m, "entity"] = x.label
        if x.action in ("regroup", "rename") and isinstance(x.group, str):
            df.loc[m, "group"] = x.group
    adds = r[r.action == "add"]
    for x in adds.itertuples():
        existing = df[df.label == x.label]
        ent = existing.entity.iloc[0] if len(existing) else x.label
        df = pd.concat([df, pd.DataFrame([dict(entity=ent, label=x.label, group=x.group, chips=x.chip_type,
                                               start=x.start, end=x.end if pd.notna(x.end) else END,
                                               flops16=float(x.flops16))])], ignore_index=True)
    print(f"  research: {len(r)} rows from {[f.name for f in files]}")
    return df


if __name__ == "__main__":
    df = pd.concat([supercomputers(), data_centers()], ignore_index=True)
    df = apply_research(df)
    # anónimos sin identificar: el año informa, el número de orden no
    first = df.groupby("entity").start.transform("min")
    m = df.label.str.startswith("Undisclosed Chinese system")
    df.loc[m, "label"] = "Undisclosed Chinese system (" + first[m].dt.year.astype(str) + ")"
    df["h100e"] = df.flops16 / H100_16BIT
    df.to_csv(D / "clusters.csv", index=False)
    print(df.shape, df.group.value_counts().to_dict())
    for y in [2010, 2013, 2016, 2018, 2020, 2022, 2024, 2025.5, 2026.8, 2028.9]:
        t = pd.Timestamp(year=int(y), month=1 + int((y % 1) * 12), day=1)
        a = df[(df.start <= t) & (df.end > t)].nlargest(5, "flops16")
        print(t.date(), " | ".join(f"{l} [{g}] {h:,.0f}" for l, g, h in zip(a.label, a.group, a.h100e)))

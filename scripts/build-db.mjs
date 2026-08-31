// Vuelca los YAML validados a SQLite. La base se regenera entera en cada build:
// la fuente de verdad son los YAML, no el fichero .db.
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'
import { cargarTodo, RAIZ } from './load.mjs'

const DESTINO = join(RAIZ, 'build/datacenters.db')
mkdirSync(join(RAIZ, 'build'), { recursive: true })
if (existsSync(DESTINO)) rmSync(DESTINO)

const db = new Database(DESTINO)
// Sin WAL: la base se publica como fichero único descargable.
db.pragma('journal_mode = DELETE')

db.exec(`
CREATE TABLE sitios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT,
  operador TEXT,
  propietario TEXT,
  cliente_ancla TEXT,
  modelo TEXT,
  municipio TEXT,
  provincia TEXT,
  ccaa TEXT,
  direccion TEXT,
  lat REAL,
  lon REAL,
  precision_coord TEXT,
  no_derivar INTEGER,
  estado TEXT NOT NULL,
  estado_detalle TEXT,
  fecha_puesta_en_servicio TEXT,
  subestacion TEXT,
  tension_kv REAL,
  titular_red TEXT,
  mw_solicitados REAL,
  mw_concedidos REAL,
  superficie_parcela_m2 REAL,
  superficie_construida_m2 REAL,
  inversion_anunciada_eur REAL,
  refrigeracion TEXT,
  agua_circuito TEXT,
  agua_sistema TEXT,
  agua_origen TEXT,
  agua_consumo_m3_ano REAL,
  agua_consumo_m3_dia REAL,
  agua_wue_l_kwh REAL,
  agua_nota TEXT,
  enlaces_proyecto TEXT,
  confianza TEXT,
  ultima_verificacion TEXT
);
CREATE TABLE alias (sitio_id TEXT, alias TEXT);
CREATE TABLE potencias (
  sitio_id TEXT, idx INTEGER, tipo TEXT, valor_mw REAL, valor_mw_max REAL, valor_mva REAL,
  acumulado INTEGER, ambito TEXT, edificio TEXT, referencia TEXT, estado_asociado TEXT,
  fecha_dato TEXT, nota TEXT
);
CREATE TABLE fases (
  sitio_id TEXT, idx INTEGER, nombre TEXT, estado TEXT,
  fecha_puesta_en_servicio TEXT, superficie_m2 REAL, nota TEXT
);
CREATE TABLE empleo (
  sitio_id TEXT, idx INTEGER, tipo TEXT, valor REAL, referencia TEXT, fecha_dato TEXT, nota TEXT
);
CREATE TABLE energia (
  sitio_id TEXT, idx INTEGER, consumo_gwh_ano REAL, referencia TEXT, fecha_dato TEXT, nota TEXT
);
CREATE TABLE computo (
  sitio_id TEXT, idx INTEGER, tipo TEXT, sistema TEXT, operador_computo TEXT, modelo TEXT,
  unidades REAL, tipo_unidad TEXT, nodos REAL, rendimiento REAL, rendimiento_unidad TEXT,
  rendimiento_tipo TEXT, rendimiento_precision TEXT, estado TEXT, fecha_dato TEXT, nota TEXT
);
CREATE TABLE incertidumbres (sitio_id TEXT, idx INTEGER, campo TEXT, descripcion TEXT);
CREATE TABLE fuentes (
  sitio_id TEXT, id TEXT, url TEXT, titulo TEXT, editor TEXT, tipo TEXT,
  fecha_publicacion TEXT, fecha_consulta TEXT, cita TEXT
);
-- Procedencia a nivel de campo: qué fuente respalda exactamente qué dato.
CREATE TABLE respaldos (sitio_id TEXT, campo TEXT, fuente_id TEXT);
CREATE TABLE red_nodos (id TEXT PRIMARY KEY, datos TEXT);
CREATE TABLE red_actuaciones (id TEXT PRIMARY KEY, datos TEXT);
CREATE TABLE red_capacidad (id TEXT PRIMARY KEY, subestacion_id TEXT, datos TEXT);
CREATE TABLE renovables (id TEXT PRIMARY KEY, datos TEXT);

CREATE INDEX idx_sitios_ccaa ON sitios(ccaa);
CREATE INDEX idx_sitios_operador ON sitios(operador);
CREATE INDEX idx_sitios_estado ON sitios(estado);
CREATE INDEX idx_pot_sitio ON potencias(sitio_id);
CREATE INDEX idx_fuentes_sitio ON fuentes(sitio_id);
CREATE INDEX idx_respaldos_sitio ON respaldos(sitio_id);
`)

const { sitios, red, actuaciones, capacidad, renovables, incidencias } = cargarTodo()

const insSitio = db.prepare(`INSERT INTO sitios VALUES (
  @id,@nombre,@tipo,@operador,@propietario,@cliente_ancla,@modelo,@municipio,@provincia,@ccaa,
  @direccion,@lat,@lon,@precision_coord,@no_derivar,@estado,@estado_detalle,@fecha_puesta_en_servicio,
  @subestacion,@tension_kv,@titular_red,@mw_solicitados,@mw_concedidos,
  @superficie_parcela_m2,@superficie_construida_m2,@inversion_anunciada_eur,@refrigeracion,
  @agua_circuito,@agua_sistema,@agua_origen,@agua_consumo_m3_ano,@agua_consumo_m3_dia,
  @agua_wue_l_kwh,@agua_nota,
  @enlaces_proyecto,@confianza,@ultima_verificacion)`)
const insAlias = db.prepare('INSERT INTO alias VALUES (?,?)')
const insPot = db.prepare('INSERT INTO potencias VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
const insFase = db.prepare('INSERT INTO fases VALUES (?,?,?,?,?,?,?)')
const insInc = db.prepare('INSERT INTO incertidumbres VALUES (?,?,?,?)')
const insEmpleo = db.prepare('INSERT INTO empleo VALUES (?,?,?,?,?,?,?)')
const insEnergia = db.prepare('INSERT INTO energia VALUES (?,?,?,?,?,?)')
const insComputo = db.prepare('INSERT INTO computo VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
const insFuente = db.prepare('INSERT INTO fuentes VALUES (?,?,?,?,?,?,?,?,?)')
const insResp = db.prepare('INSERT INTO respaldos VALUES (?,?,?)')
const insRed = db.prepare('INSERT INTO red_nodos VALUES (?,?)')
const insRen = db.prepare('INSERT INTO renovables VALUES (?,?)')
const insAct = db.prepare('INSERT INTO red_actuaciones VALUES (?,?)')
const insCap = db.prepare('INSERT INTO red_capacidad VALUES (?,?,?)')

const cargar = db.transaction(() => {
  for (const s of sitios) {
    const c = s.conexion_electrica ?? {}
    const ag = s.agua ?? {}
    insSitio.run({
      id: s.id,
      nombre: s.nombre,
      tipo: s.tipo,
      operador: s.operador,
      propietario: s.propietario ?? null,
      cliente_ancla: s.cliente_ancla ?? null,
      modelo: s.modelo,
      municipio: s.ubicacion.municipio,
      provincia: s.ubicacion.provincia,
      ccaa: s.ubicacion.ccaa,
      direccion: s.ubicacion.direccion,
      lat: s.ubicacion.lat,
      lon: s.ubicacion.lon,
      precision_coord: s.ubicacion.precision,
      no_derivar: s.ubicacion.no_derivar ? 1 : 0,
      estado: s.estado,
      estado_detalle: s.estado_detalle ?? null,
      fecha_puesta_en_servicio: s.fecha_puesta_en_servicio ?? null,
      subestacion: c.subestacion ?? null,
      tension_kv: c.tension_kv ?? null,
      titular_red: c.titular_red ?? null,
      mw_solicitados: c.mw_solicitados ?? null,
      mw_concedidos: c.mw_concedidos ?? null,
      superficie_parcela_m2: s.superficie_parcela_m2 ?? null,
      superficie_construida_m2: s.superficie_construida_m2 ?? null,
      inversion_anunciada_eur: s.inversion_anunciada_eur ?? null,
      refrigeracion: s.refrigeracion ?? null,
      agua_circuito: ag.circuito ?? null,
      agua_sistema: ag.sistema ?? null,
      agua_origen: ag.origen ?? null,
      agua_consumo_m3_ano: ag.consumo_m3_ano ?? null,
      agua_consumo_m3_dia: ag.consumo_m3_dia ?? null,
      agua_wue_l_kwh: ag.wue_l_kwh ?? null,
      agua_nota: ag.nota ?? null,
      enlaces_proyecto: JSON.stringify(s.enlaces_proyecto ?? []),
      confianza: s.confianza,
      ultima_verificacion: s.ultima_verificacion,
    })

    for (const a of s.alias) insAlias.run(s.id, a)
    for (const [i, p] of s.potencia.entries()) {
      insPot.run(s.id, i, p.tipo, p.valor_mw, p.valor_mw_max ?? null, p.valor_mva ?? null, p.acumulado ? 1 : 0, p.ambito, p.edificio ?? null, p.referencia, p.estado_asociado, p.fecha_dato, p.nota)
      for (const f of p.fuentes) insResp.run(s.id, `potencia[${i}]`, f)
    }
    for (const [i, f] of s.fases.entries()) {
      insFase.run(s.id, i, f.nombre, f.estado, f.fecha_puesta_en_servicio, f.superficie_m2, f.nota)
      for (const src of f.fuentes) insResp.run(s.id, `fases[${i}]`, src)
    }
    for (const [i, u] of s.incertidumbres.entries()) {
      insInc.run(s.id, i, u.campo, u.descripcion)
      for (const src of u.fuentes) insResp.run(s.id, `incertidumbres[${i}]`, src)
    }
    for (const [i, e] of (s.empleo ?? []).entries()) {
      insEmpleo.run(s.id, i, e.tipo, e.valor, e.referencia, e.fecha_dato, e.nota)
      for (const src of e.fuentes) insResp.run(s.id, `empleo[${i}]`, src)
    }
    for (const [i, e] of (s.energia ?? []).entries()) {
      insEnergia.run(s.id, i, e.consumo_gwh_ano, e.referencia, e.fecha_dato, e.nota)
      for (const src of e.fuentes) insResp.run(s.id, `energia[${i}]`, src)
    }
    for (const [i, c] of (s.computo ?? []).entries()) {
      insComputo.run(
        s.id, i, c.tipo, c.sistema, c.operador_computo, c.modelo, c.unidades, c.tipo_unidad,
        c.nodos, c.rendimiento, c.rendimiento_unidad, c.rendimiento_tipo, c.rendimiento_precision,
        c.estado, c.fecha_dato, c.nota,
      )
      for (const src of c.fuentes) insResp.run(s.id, `computo[${i}]`, src)
    }
    for (const f of s.fuentes) {
      insFuente.run(s.id, f.id, f.url, f.titulo, f.editor, f.tipo, f.fecha_publicacion, f.fecha_consulta, f.cita)
    }
    for (const src of s.ubicacion.fuentes) insResp.run(s.id, 'ubicacion', src)
    for (const src of s.estado_fuentes) insResp.run(s.id, 'estado', src)
    for (const src of s.conexion_electrica?.fuentes ?? []) insResp.run(s.id, 'conexion_electrica', src)
    for (const src of s.agua?.fuentes ?? []) insResp.run(s.id, 'agua', src)
  }
  for (const n of red) insRed.run(n.id, JSON.stringify(n))
  for (const a of actuaciones) insAct.run(a.id, JSON.stringify(a))
  for (const c of capacidad) insCap.run(c.id, c.subestacion_id ?? null, JSON.stringify(c))
  for (const r of renovables) insRen.run(r.id, JSON.stringify(r))
})
cargar()

const errores = incidencias.filter((i) => i.nivel === 'error').length
console.log(`SQLite escrito en build/datacenters.db — ${sitios.length} emplazamientos, ${red.length} subestaciones, ${actuaciones.length} actuaciones, ${capacidad.length} nudos con capacidad, ${renovables.length} renovables (${errores} ficheros con errores quedaron fuera)`)
db.close()

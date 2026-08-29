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
  enlaces_proyecto TEXT,
  confianza TEXT,
  ultima_verificacion TEXT
);
CREATE TABLE alias (sitio_id TEXT, alias TEXT);
CREATE TABLE potencias (
  sitio_id TEXT, idx INTEGER, tipo TEXT, valor_mw REAL, valor_mw_max REAL,
  ambito TEXT, referencia TEXT, estado_asociado TEXT, fecha_dato TEXT, nota TEXT
);
CREATE TABLE fases (
  sitio_id TEXT, idx INTEGER, nombre TEXT, estado TEXT,
  fecha_puesta_en_servicio TEXT, superficie_m2 REAL, nota TEXT
);
CREATE TABLE incertidumbres (sitio_id TEXT, idx INTEGER, campo TEXT, descripcion TEXT);
CREATE TABLE fuentes (
  sitio_id TEXT, id TEXT, url TEXT, titulo TEXT, editor TEXT, tipo TEXT,
  fecha_publicacion TEXT, fecha_consulta TEXT, cita TEXT
);
-- Procedencia a nivel de campo: qué fuente respalda exactamente qué dato.
CREATE TABLE respaldos (sitio_id TEXT, campo TEXT, fuente_id TEXT);
CREATE TABLE red_nodos (id TEXT PRIMARY KEY, datos TEXT);
CREATE TABLE renovables (id TEXT PRIMARY KEY, datos TEXT);

CREATE INDEX idx_sitios_ccaa ON sitios(ccaa);
CREATE INDEX idx_sitios_operador ON sitios(operador);
CREATE INDEX idx_sitios_estado ON sitios(estado);
CREATE INDEX idx_pot_sitio ON potencias(sitio_id);
CREATE INDEX idx_fuentes_sitio ON fuentes(sitio_id);
CREATE INDEX idx_respaldos_sitio ON respaldos(sitio_id);
`)

const { sitios, red, renovables, incidencias } = cargarTodo()

const insSitio = db.prepare(`INSERT INTO sitios VALUES (
  @id,@nombre,@tipo,@operador,@propietario,@cliente_ancla,@modelo,@municipio,@provincia,@ccaa,
  @direccion,@lat,@lon,@precision_coord,@estado,@estado_detalle,@fecha_puesta_en_servicio,
  @subestacion,@tension_kv,@titular_red,@mw_solicitados,@mw_concedidos,
  @superficie_parcela_m2,@superficie_construida_m2,@inversion_anunciada_eur,@refrigeracion,
  @enlaces_proyecto,@confianza,@ultima_verificacion)`)
const insAlias = db.prepare('INSERT INTO alias VALUES (?,?)')
const insPot = db.prepare('INSERT INTO potencias VALUES (?,?,?,?,?,?,?,?,?,?)')
const insFase = db.prepare('INSERT INTO fases VALUES (?,?,?,?,?,?,?)')
const insInc = db.prepare('INSERT INTO incertidumbres VALUES (?,?,?,?)')
const insFuente = db.prepare('INSERT INTO fuentes VALUES (?,?,?,?,?,?,?,?,?)')
const insResp = db.prepare('INSERT INTO respaldos VALUES (?,?,?)')
const insRed = db.prepare('INSERT INTO red_nodos VALUES (?,?)')
const insRen = db.prepare('INSERT INTO renovables VALUES (?,?)')

const cargar = db.transaction(() => {
  for (const s of sitios) {
    const c = s.conexion_electrica ?? {}
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
      enlaces_proyecto: JSON.stringify(s.enlaces_proyecto ?? []),
      confianza: s.confianza,
      ultima_verificacion: s.ultima_verificacion,
    })

    for (const a of s.alias) insAlias.run(s.id, a)
    for (const [i, p] of s.potencia.entries()) {
      insPot.run(s.id, i, p.tipo, p.valor_mw, p.valor_mw_max ?? null, p.ambito, p.referencia, p.estado_asociado, p.fecha_dato, p.nota)
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
    for (const f of s.fuentes) {
      insFuente.run(s.id, f.id, f.url, f.titulo, f.editor, f.tipo, f.fecha_publicacion, f.fecha_consulta, f.cita)
    }
    for (const src of s.ubicacion.fuentes) insResp.run(s.id, 'ubicacion', src)
    for (const src of s.estado_fuentes) insResp.run(s.id, 'estado', src)
    for (const src of s.conexion_electrica?.fuentes ?? []) insResp.run(s.id, 'conexion_electrica', src)
  }
  for (const n of red) insRed.run(n.id, JSON.stringify(n))
  for (const r of renovables) insRen.run(r.id, JSON.stringify(r))
})
cargar()

const errores = incidencias.filter((i) => i.nivel === 'error').length
console.log(`SQLite escrito en build/datacenters.db — ${sitios.length} emplazamientos, ${red.length} nodos de red, ${renovables.length} renovables (${errores} ficheros con errores quedaron fuera)`)
db.close()

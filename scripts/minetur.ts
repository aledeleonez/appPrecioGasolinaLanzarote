import type { IdIsla } from '../src/islas.ts'
import type { DatosGasolineras, Gasolinera } from '../src/tipos.ts'

// API REST de precios de carburantes del Ministerio. Se piden las dos provincias
// canarias (Las Palmas y Santa Cruz de Tenerife) y se reparten por isla.
const API_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/'
const PROVINCIAS = ['35', '38']

// Códigos de los municipios de cada isla en la API
// (https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/35 y /38)
export const MUNICIPIOS: Record<IdIsla, Record<string, string>> = {
  lanzarote: {
    arrecife: '5237',
    teguise: '5256',
    haria: '5243',
    yaiza: '5266',
    tinajo: '5261',
    sanBartolome: '5251',
    tias: '5260',
  },
  fuerteventura: {
    antigua: '5236',
    betancuria: '5240',
    laOliva: '5247',
    pajara: '5248',
    puertoDelRosario: '5250',
    tuineje: '5262',
  },
  'gran-canaria': {
    agaete: '5233',
    aguimes: '5234',
    laAldeaDeSanNicolas: '5235',
    artenara: '5238',
    arucas: '5239',
    firgas: '5241',
    galdar: '5242',
    ingenio: '5244',
    mogan: '5245',
    moya: '5246',
    lasPalmasDeGranCanaria: '5249',
    sanBartolomeDeTirajana: '5252',
    santaBrigida: '5253',
    santaLuciaDeTirajana: '5254',
    santaMariaDeGuia: '5255',
    tejeda: '5257',
    telde: '5258',
    teror: '5259',
    valleseco: '5263',
    valsequillo: '5264',
    vegaDeSanMateo: '5265',
  },
  tenerife: {
    adeje: '5691',
    arafo: '5694',
    arico: '5695',
    arona: '5696',
    buenavistaDelNorte: '5700',
    candelaria: '5701',
    fasnia: '5702',
    garachico: '5705',
    granadillaDeAbona: '5707',
    laGuancha: '5708',
    guiaDeIsora: '5709',
    guimar: '5710',
    icodDeLosVinos: '5712',
    laMatanzaDeAcentejo: '5714',
    laOrotava: '5715',
    puertoDeLaCruz: '5717',
    losRealejos: '5720',
    elRosario: '5721',
    laLaguna: '5723',
    sanJuanDeLaRambla: '5724',
    sanMiguelDeAbona: '5725',
    santaCruzDeTenerife: '5728',
    santaUrsula: '5729',
    santiagoDelTeide: '5730',
    elSauzal: '5731',
    losSilos: '5732',
    tacoronte: '5733',
    elTanque: '5734',
    tegueste: '5736',
    laVictoriaDeAcentejo: '5741',
    vilaflor: '5742',
  },
  'la-gomera': {
    agulo: '5692',
    alajero: '5693',
    hermigua: '5711',
    sanSebastianDeLaGomera: '5726',
    valleGranRey: '5738',
    vallehermoso: '5739',
  },
  'la-palma': {
    barlovento: '5697',
    brenaAlta: '5698',
    brenaBaja: '5699',
    fuencaliente: '5704',
    garafia: '5706',
    losLlanosDeAridane: '5713',
    elPaso: '5716',
    puntagorda: '5718',
    puntallana: '5719',
    sanAndresYSauces: '5722',
    santaCruzDeLaPalma: '5727',
    tazacorte: '5735',
    tijarafe: '5737',
    villaDeMazo: '5743',
  },
  'el-hierro': {
    frontera: '5703',
    valverde: '5740',
    elPinar: '8112',
  },
}

// Solo los campos que usamos; la API devuelve muchos más.
// Los números llegan como texto con coma decimal ("1,459") y vacíos si no hay dato.
export type EstacionApi = {
  IDEESS: string
  IDMunicipio: string
  'Rótulo': string
  Horario: string
  Localidad: string
  Municipio: string
  'Dirección': string
  Latitud: string
  'Longitud (WGS84)': string
  'Precio Gasolina 95 E5': string
  'Precio Gasolina 98 E5': string
  'Precio Gasoleo A': string
}

type RespuestaProvincia = {
  Fecha: string
  ListaEESSPrecio: EstacionApi[]
}

// Convierte "1,459" en 1.459. Devuelve null si el valor está vacío o no es un número.
export function parseDecimal(valor: string): number | null {
  if (!valor.trim()) return null
  const numero = Number(valor.replace(',', '.'))
  return Number.isNaN(numero) ? null : numero
}

// La API pone el artículo al final: "Oliva (La)" → "La Oliva", "CASTILLO (EL)" → "EL CASTILLO"
export function moverArticulo(nombre: string): string {
  const partes = nombre.match(/^(.+?)\s*\((\p{L}+)\)$/u)
  return partes ? `${partes[2]} ${partes[1]}` : nombre
}

// Devuelve null si la estación no tiene coordenadas válidas
export function normalizarEstacion(estacion: EstacionApi): Gasolinera | null {
  const latitud = parseDecimal(estacion.Latitud)
  const longitud = parseDecimal(estacion['Longitud (WGS84)'])
  if (latitud === null || longitud === null) return null
  return {
    id: estacion.IDEESS,
    rotulo: estacion['Rótulo'],
    horario: estacion.Horario,
    localidad: moverArticulo(estacion.Localidad),
    municipio: moverArticulo(estacion.Municipio),
    direccion: estacion['Dirección'],
    latitud,
    longitud,
    precios: {
      gasolina95: parseDecimal(estacion['Precio Gasolina 95 E5']),
      gasolina98: parseDecimal(estacion['Precio Gasolina 98 E5']),
      gasoleo: parseDecimal(estacion['Precio Gasoleo A']),
    },
  }
}

async function fetchProvincia(codigo: string): Promise<RespuestaProvincia> {
  const respuesta = await fetch(API_URL + codigo)
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener la provincia ${codigo}`)
  }
  return respuesta.json() as Promise<RespuestaProvincia>
}

// Agrupa las estaciones de las dos provincias por isla según su municipio
export function repartirPorIsla(estaciones: EstacionApi[], fecha: string): Record<IdIsla, DatosGasolineras> {
  return Object.fromEntries(
    Object.entries(MUNICIPIOS).map(([isla, municipios]) => {
      const codigos = new Set(Object.values(municipios))
      const gasolineras = estaciones
        .filter((e) => codigos.has(e.IDMunicipio))
        .map(normalizarEstacion)
        .filter((g): g is Gasolinera => g !== null)
      return [isla, { fecha, gasolineras }]
    }),
  ) as Record<IdIsla, DatosGasolineras>
}

export async function descargarGasolineras(): Promise<Record<IdIsla, DatosGasolineras>> {
  const respuestas = await Promise.all(PROVINCIAS.map(fetchProvincia))
  return repartirPorIsla(
    respuestas.flatMap((r) => r.ListaEESSPrecio),
    // Las dos respuestas traen la misma fecha
    respuestas[0].Fecha,
  )
}

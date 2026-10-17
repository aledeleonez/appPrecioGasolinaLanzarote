// API REST de precios de carburantes del Ministerio
const API_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/'

// Códigos de los municipios de Lanzarote en la API
export const MUNICIPIOS = {
  arrecife: '5237',
  teguise: '5256',
  haria: '5243',
  yaiza: '5266',
  tinajo: '5261',
  sanBartolome: '5251',
  tias: '5260',
} as const

export type Carburante =
  | 'Precio Gasolina 95 E5'
  | 'Precio Gasolina 98 E5'
  | 'Precio Gasoleo A'

// Solo los campos que usa la app; la API devuelve muchos más.
// Los números llegan como texto con coma decimal ("1,459") y vacíos si no hay dato.
export type Gasolinera = {
  IDEESS: string
  'Rótulo': string
  Horario: string
  Localidad: string
  'Dirección': string
  Latitud: string
  'Longitud (WGS84)': string
} & Record<Carburante, string>

type RespuestaMunicipio = {
  Fecha: string
  ListaEESSPrecio: Gasolinera[]
}

async function fetchMunicipio(codigo: string): Promise<RespuestaMunicipio> {
  const respuesta = await fetch(API_URL + codigo)
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener el municipio ${codigo}`)
  }
  return respuesta.json()
}

export async function fetchGasolineras(): Promise<Gasolinera[]> {
  const respuestas = await Promise.all(Object.values(MUNICIPIOS).map(fetchMunicipio))
  return respuestas.flatMap((r) => r.ListaEESSPrecio)
}

// Todas las respuestas traen la misma fecha, así que basta con un municipio pequeño
export async function fetchFecha(): Promise<string> {
  const respuesta = await fetchMunicipio(MUNICIPIOS.haria)
  return respuesta.Fecha
}

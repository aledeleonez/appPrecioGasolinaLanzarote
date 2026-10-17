import type { DatosGasolineras, Gasolinera } from '../src/tipos.ts'

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

// Solo los campos que usamos; la API devuelve muchos más.
// Los números llegan como texto con coma decimal ("1,459") y vacíos si no hay dato.
export type EstacionApi = {
  IDEESS: string
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

type RespuestaMunicipio = {
  Fecha: string
  ListaEESSPrecio: EstacionApi[]
}

// Convierte "1,459" en 1.459. Devuelve null si el valor está vacío o no es un número.
export function parseDecimal(valor: string): number | null {
  if (!valor.trim()) return null
  const numero = Number(valor.replace(',', '.'))
  return Number.isNaN(numero) ? null : numero
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
    localidad: estacion.Localidad,
    municipio: estacion.Municipio,
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

async function fetchMunicipio(codigo: string): Promise<RespuestaMunicipio> {
  const respuesta = await fetch(API_URL + codigo)
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener el municipio ${codigo}`)
  }
  return respuesta.json() as Promise<RespuestaMunicipio>
}

export async function descargarGasolineras(): Promise<DatosGasolineras> {
  const respuestas = await Promise.all(Object.values(MUNICIPIOS).map(fetchMunicipio))
  return {
    // Todas las respuestas traen la misma fecha
    fecha: respuestas[0].Fecha,
    gasolineras: respuestas
      .flatMap((r) => r.ListaEESSPrecio)
      .map(normalizarEstacion)
      .filter((g): g is Gasolinera => g !== null),
  }
}

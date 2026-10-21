// Formato de los JSON por isla (lanzarote.json...) que genera scripts/actualizar-datos.ts y lee la web

export type Carburante = 'gasolina95' | 'gasolina98' | 'gasoleo'

export const NOMBRES_CARBURANTE: Record<Carburante, string> = {
  gasolina95: 'Gasolina 95',
  gasolina98: 'Gasolina 98',
  gasoleo: 'Gasóleo',
}

export type Gasolinera = {
  id: string
  rotulo: string
  horario: string
  localidad: string
  // Municipio de la isla, con tildes y el artículo delante ("San Bartolomé", "La Oliva")
  municipio: string
  direccion: string
  latitud: number
  longitud: number
  // En euros por litro; null si la gasolinera no vende ese carburante
  precios: Record<Carburante, number | null>
}

export type DatosGasolineras = {
  // Fecha y hora de los precios, tal como la da la API ("17/10/2026 13:19:17")
  fecha: string
  gasolineras: Gasolinera[]
}

import type { DatosGasolineras } from '../tipos'

// JSON estático que genera la GitHub Action a partir de la API del Ministerio
const DATOS_URL = `${import.meta.env.BASE_URL}data/gasolineras.json`

export async function fetchGasolineras(): Promise<DatosGasolineras> {
  const respuesta = await fetch(DATOS_URL)
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los precios`)
  }
  return respuesta.json()
}

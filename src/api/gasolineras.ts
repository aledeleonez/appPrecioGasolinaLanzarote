import type { IdIsla } from '../islas'
import type { DatosGasolineras } from '../tipos'

// JSON estático por isla que genera la GitHub Action a partir de la API del Ministerio
export async function fetchGasolineras(isla: IdIsla): Promise<DatosGasolineras> {
  const respuesta = await fetch(`${import.meta.env.BASE_URL}data/${isla}.json`)
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los precios`)
  }
  return respuesta.json()
}

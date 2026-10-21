// Descarga los precios de la API del Ministerio y los guarda en public/data/<isla>.json.
// Lo ejecuta la GitHub Action antes de cada despliegue y `npm run dev` al arrancar.
import { mkdir, writeFile } from 'node:fs/promises'
import type { IdIsla } from '../src/islas.ts'
import { descargarGasolineras, MUNICIPIOS } from './minetur.ts'

const DESTINO = new URL('../public/data/', import.meta.url)

await mkdir(DESTINO, { recursive: true })

for (const isla of Object.keys(MUNICIPIOS) as IdIsla[]) {
  const datos = await descargarGasolineras(isla)
  if (datos.gasolineras.length === 0) {
    throw new Error(`La API no ha devuelto ninguna gasolinera de ${isla}`)
  }
  await writeFile(new URL(`${isla}.json`, DESTINO), JSON.stringify(datos))
  console.log(`${isla}: ${datos.gasolineras.length} gasolineras guardadas (precios del ${datos.fecha})`)
}

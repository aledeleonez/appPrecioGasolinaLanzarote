// Descarga los precios de la API del Ministerio y los guarda en public/data/gasolineras.json.
// Lo ejecuta la GitHub Action antes de cada despliegue y `npm run dev` al arrancar.
import { mkdir, writeFile } from 'node:fs/promises'
import { descargarGasolineras } from './minetur.ts'

const DESTINO = new URL('../public/data/gasolineras.json', import.meta.url)

const datos = await descargarGasolineras()
if (datos.gasolineras.length === 0) {
  throw new Error('La API no ha devuelto ninguna gasolinera')
}

await mkdir(new URL('.', DESTINO), { recursive: true })
await writeFile(DESTINO, JSON.stringify(datos))
console.log(`${datos.gasolineras.length} gasolineras guardadas (precios del ${datos.fecha})`)

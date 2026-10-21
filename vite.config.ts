import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { ISLAS } from './src/islas.ts'

// Secciones de cada isla en src/App.tsx, sin contar su portada
const SECCIONES = ['gasolina98', 'gasoleo', 'mapa']

// Las secciones sueltas son las rutas antiguas, que redirigen a Lanzarote.
// Cada isla va como lanzarote.html y lanzarote/index.html para que /lanzarote
// funcione sirva Pages el archivo o la carpeta.
const RUTAS = [
  ...SECCIONES,
  ...ISLAS.flatMap(({ id }) => [id, `${id}/index`, ...SECCIONES.map((s) => `${id}/${s}`)]),
]

// GitHub Pages no redirige las rutas de una SPA a index.html. Copiándolo como
// lanzarote/mapa.html, etc., Pages lo sirve en /lanzarote/mapa sin #. El 404.html
// cubre cualquier otra ruta (React Router muestra la página que toque).
function paginasParaGithubPages(): Plugin {
  let salida = ''
  return {
    name: 'paginas-para-github-pages',
    apply: 'build',
    configResolved(config) {
      salida = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const indice = resolve(salida, 'index.html')
      for (const pagina of [...RUTAS, '404']) {
        const destino = resolve(salida, `${pagina}.html`)
        await mkdir(dirname(destino), { recursive: true })
        await copyFile(indice, destino)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve la app bajo /appPrecioGasolinaLanzarote/
  base: '/appPrecioGasolinaLanzarote/',
  plugins: [react(), paginasParaGithubPages()],
  build: {
    // MapLibre ocupa algo más de 1 MB, pero se carga aparte y solo en el mapa
    chunkSizeWarningLimit: 1200,
  },
})

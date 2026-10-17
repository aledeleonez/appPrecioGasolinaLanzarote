import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Rutas de src/App.tsx, sin contar la portada
const RUTAS = ['gasolina98', 'gasoleo', 'mapa']

// GitHub Pages no redirige las rutas de una SPA a index.html. Copiándolo como
// mapa.html, etc., Pages lo sirve en /mapa sin #. El 404.html cubre cualquier
// otra ruta (React Router muestra la página que toque).
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
        await copyFile(indice, resolve(salida, `${pagina}.html`))
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

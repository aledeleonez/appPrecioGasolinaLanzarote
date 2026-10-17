import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve la app bajo /appPrecioGasolinaLanzarote/
  base: '/appPrecioGasolinaLanzarote/',
  plugins: [react()],
  build: {
    // MapLibre ocupa algo más de 1 MB, pero se carga aparte y solo en el mapa
    chunkSizeWarningLimit: 1200,
  },
})

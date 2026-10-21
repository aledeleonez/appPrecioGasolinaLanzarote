import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Cloudflare sirve la app en la raíz del dominio y devuelve index.html en
  // cualquier ruta (/lanzarote/mapa...), así que no hacen falta copias por ruta
  base: '/',
  plugins: [react()],
  build: {
    // MapLibre ocupa algo más de 1 MB, pero se carga aparte y solo en el mapa
    chunkSizeWarningLimit: 1200,
  },
})

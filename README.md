# Precio de la Gasolina en Lanzarote

Web que muestra los precios de la gasolina 95, la gasolina 98 y el gasóleo en las gasolineras de Lanzarote, ordenados de más barato a más caro, y un mapa con todas las estaciones.

Los datos se obtienen en tiempo real de la [API de precios de carburantes](https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/) del Ministerio, que se actualiza cada media hora.

Publicada en https://aledeleonez.github.io/appPrecioGasolinaLanzarote/

## Tecnologías

React 19, TypeScript, Vite, React Router, Bootstrap y Leaflet.

## Desarrollo

Requiere Node 22.22 o superior.

```sh
npm install
npm run dev       # servidor de desarrollo
npm test          # tests con Vitest
npm run lint      # oxlint
npm run build     # compila en dist/
npm run deploy    # compila y publica en GitHub Pages
```

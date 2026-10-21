# Gasolina Canarias

Web que muestra los precios de la gasolina 95, la gasolina 98 y el gasóleo en las casi 500 gasolineras de las siete islas Canarias, ordenados de más barato a más caro, y un mapa con todas las estaciones.

**[Ver la web](https://aledeleonez.github.io/PrecioGasolinaCanarias/)**

![Ranking de precios de la gasolina 95 en Tenerife](docs/capturas/lista.png)

## Qué puedes hacer

- Elegir la isla: Lanzarote, Fuerteventura, Gran Canaria, Tenerife, La Gomera, La Palma o El Hierro. La portada abre la última que elegiste.
- Ver el ranking de las gasolineras de la isla para cada carburante, con la diferencia de precio respecto a la más barata.
- Filtrar por municipio y compartir el enlace ya filtrado, por ejemplo [gasóleo en Puerto del Rosario](https://aledeleonez.github.io/PrecioGasolinaCanarias/fuerteventura/gasoleo?municipio=puerto-del-rosario) o [gasolina 95 en Las Palmas de Gran Canaria](https://aledeleonez.github.io/PrecioGasolinaCanarias/gran-canaria?municipio=las-palmas-de-gran-canaria).
- Buscar gasolineras en el mapa de cada isla, con el logo de su marca, y ver sus precios al pulsar en ellas.
- Usarla en el móvil y en modo claro u oscuro.

![Mapa de gasolineras de Fuerteventura con sus logos, agrupadas por zona](docs/capturas/mapa.png)

| Móvil | Modo oscuro |
| :---: | :---: |
| <img src="docs/capturas/movil-claro.png" alt="Precios del gasóleo en Puerto del Rosario en el móvil" width="300"> | <img src="docs/capturas/movil-oscuro.png" alt="Precios de la gasolina 95 en Las Palmas de Gran Canaria en modo oscuro" width="300"> |

## Cómo funciona

Los datos salen de la [API de precios de carburantes](https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/) del Ministerio, que se actualiza cada media hora. Una GitHub Action (`.github/workflows/deploy.yml`) los descarga cada media hora con `scripts/actualizar-datos.ts`: pide las dos provincias canarias, reparte las gasolineras por isla según su municipio (la lista está en `scripts/minetur.ts`) y guarda un JSON limpio por isla (`lanzarote.json`, `tenerife.json`...). Después vuelve a publicar la web, así que el navegador solo descarga el JSON de la isla que estás viendo.

Cada isla tiene sus propias rutas (`/tenerife`, `/tenerife/gasoleo`, `/tenerife/mapa`...). Su nombre y el encuadre del mapa están en `src/islas.ts`.

Los logos están en `public/logos` y `src/utils/marcas.ts` los asigna según el rótulo de la gasolinera. Las marcas sin logo se muestran con sus iniciales.

## Tecnologías

React 19, TypeScript, Vite, TanStack Query, React Router, Bootstrap y MapLibre (con mapas de OpenFreeMap). Se publica en GitHub Pages con GitHub Actions.

## Desarrollo

Requiere Node 22.22 o superior.

```sh
npm install
npm run dev       # descarga los datos y arranca el servidor de desarrollo
npm run datos     # solo actualiza los JSON de public/data/
npm test          # tests con Vitest
npm run lint      # oxlint
npm run build     # compila en dist/
```

Cada push a `main` se publica solo. Para forzar un despliegue, lanza el workflow **Deploy** a mano desde la pestaña Actions.

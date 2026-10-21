import { useMemo, useRef, useState } from 'react'
import { setWorkerUrl, type Map as MapaMapLibre } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from 'react-map-gl/maplibre'
import { useSearchParams } from 'react-router'
import Supercluster from 'supercluster'
import { useGasolineras } from '../hooks/useGasolineras'
import { useIsla } from '../hooks/useIsla'
import { useTema } from '../hooks/useTema'
import { NOMBRES_CARBURANTE, type Carburante, type Gasolinera } from '../tipos'
import { formatearPrecio, precioMinimo } from '../utils/precios'
import EstadoCarga from './EstadoCarga'
import LogoMarca from './LogoMarca'
import './GasStationMap.css'

// Mapas vectoriales gratuitos y sin clave de API, con datos de OpenStreetMap
const ESTILOS_MAPA = {
  claro: 'https://tiles.openfreemap.org/styles/liberty',
  oscuro: 'https://tiles.openfreemap.org/styles/dark',
}

const CARBURANTES = Object.keys(NOMBRES_CARBURANTE) as Carburante[]

// MapLibre busca su worker junto a su propio archivo, pero Vite lo empaqueta
// todo junto; así se copia aparte y le decimos dónde está.
setWorkerUrl(workerUrl)

type Vista = {
  limites: [number, number, number, number]
  zoom: number
}

function vistaDe(mapa: MapaMapLibre): Vista {
  const b = mapa.getBounds()
  return { limites: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], zoom: mapa.getZoom() }
}

type TarjetaProps = {
  gasolinera: Gasolinera
  minimos: Record<Carburante, number | null>
}

function TarjetaGasolinera({ gasolinera, minimos }: TarjetaProps) {
  const esLaMasBarata = (c: Carburante) =>
    gasolinera.precios[c] !== null && gasolinera.precios[c] === minimos[c]

  return (
    <div className='tarjeta-mapa'>
      <div className='tarjeta-mapa-cabecera'>
        <div className='marcador marcador-pequeno'>
          <LogoMarca rotulo={gasolinera.rotulo} />
        </div>
        <div>
          <h6 className='mb-0'>{gasolinera.rotulo}</h6>
          <small className='text-muted'>
            {gasolinera.direccion}, {gasolinera.localidad}
          </small>
        </div>
      </div>
      <ul className='list-unstyled mb-0'>
        {CARBURANTES.map((c) => (
          <li key={c} className='tarjeta-mapa-precio'>
            <span>{NOMBRES_CARBURANTE[c]}</span>
            <span
              className={
                gasolinera.precios[c] === null
                  ? 'text-muted'
                  : esLaMasBarata(c)
                    ? 'fw-bold text-success'
                    : 'fw-bold'
              }
            >
              {formatearPrecio(gasolinera.precios[c])}
            </span>
          </li>
        ))}
      </ul>
      {CARBURANTES.some(esLaMasBarata) && (
        <small className='d-block mt-2 text-success'>En verde, el precio más barato de la isla</small>
      )}
    </div>
  )
}

// Componente que renderiza el mapa
const GasStationMap = () => {
  const isla = useIsla()
  const { data, error, refetch } = useGasolineras(isla.id)
  const tema = useTema()
  const mapaRef = useRef<MapRef>(null)
  const [vista, setVista] = useState<Vista | null>(null)
  // La lista enlaza a /<isla>/mapa?gasolinera=<id> para abrir el mapa centrado en esa gasolinera
  const [parametros] = useSearchParams()
  const [idSeleccionada, setIdSeleccionada] = useState(parametros.get('gasolinera'))
  const seleccionada = data?.gasolineras.find((g) => g.id === idSeleccionada) ?? null

  const minimos = useMemo(() => {
    const gasolineras = data?.gasolineras ?? []
    return Object.fromEntries(
      CARBURANTES.map((c) => [c, precioMinimo(gasolineras, c)]),
    ) as Record<Carburante, number | null>
  }, [data])

  // Agrupa las gasolineras cercanas para que no se amontonen al alejar el mapa (Arrecife, Puerto del Rosario)
  const indice = useMemo(() => {
    const supercluster = new Supercluster<Gasolinera>({ radius: 40, maxZoom: 15 })
    supercluster.load(
      (data?.gasolineras ?? []).map((g) => ({
        type: 'Feature' as const,
        properties: g,
        geometry: { type: 'Point' as const, coordinates: [g.longitud, g.latitud] },
      })),
    )
    return supercluster
  }, [data])

  const puntos = vista ? indice.getClusters(vista.limites, Math.floor(vista.zoom)) : []

  if (!data) return <EstadoCarga error={error} onReintentar={() => refetch()} />

  // MapGL solo usa la vista inicial al montarse, que es cuando ya hay datos
  const vistaInicial = seleccionada
    ? { longitude: seleccionada.longitud, latitude: seleccionada.latitud, zoom: 16 }
    : { bounds: isla.limites, fitBoundsOptions: { padding: 24 } }

  return (
    <MapGL
      ref={mapaRef}
      initialViewState={vistaInicial}
      mapStyle={ESTILOS_MAPA[tema]}
      style={{ width: '100%', height: 'calc(100dvh - var(--alto-barra))' }}
      onLoad={(e) => setVista(vistaDe(e.target))}
      onMove={(e) => setVista(vistaDe(e.target))}
    >
      <NavigationControl position='top-right' />
      <GeolocateControl position='top-right' />
      {puntos.map((punto) => {
        const [longitud, latitud] = punto.geometry.coordinates
        if ('cluster' in punto.properties) {
          const { cluster_id: idGrupo, point_count: total } = punto.properties
          return (
            <Marker key={`grupo-${idGrupo}`} longitude={longitud} latitude={latitud}>
              <button
                type='button'
                className='marcador marcador-grupo'
                aria-label={`${total} gasolineras, acercar`}
                onClick={() =>
                  mapaRef.current?.easeTo({
                    center: [longitud, latitud],
                    zoom: indice.getClusterExpansionZoom(idGrupo),
                  })
                }
              >
                {total}
              </button>
            </Marker>
          )
        }
        const item = punto.properties
        return (
          <Marker
            key={item.id}
            longitude={longitud}
            latitude={latitud}
            onClick={(e) => {
              // Sin esto, el clic llega al mapa y cierra el popup recién abierto
              e.originalEvent.stopPropagation()
              setIdSeleccionada(item.id)
            }}
          >
            <button
              type='button'
              className={`marcador ${seleccionada?.id === item.id ? 'marcador-activo' : ''}`}
              aria-label={`${item.rotulo}, ${item.direccion}`}
              title={item.rotulo}
            >
              <LogoMarca rotulo={item.rotulo} />
            </button>
          </Marker>
        )
      })}
      {seleccionada && (
        <Popup
          longitude={seleccionada.longitud}
          latitude={seleccionada.latitud}
          anchor='bottom'
          offset={24}
          maxWidth='300px'
          onClose={() => setIdSeleccionada(null)}
        >
          <TarjetaGasolinera gasolinera={seleccionada} minimos={minimos} />
        </Popup>
      )}
    </MapGL>
  )
}

export default GasStationMap

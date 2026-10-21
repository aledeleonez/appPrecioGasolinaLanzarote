import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useGasolineras } from '../hooks/useGasolineras'
import { useIsla } from '../hooks/useIsla'
import { NOMBRES_CARBURANTE, type Carburante, type Gasolinera } from '../tipos'
import {
  formatearDiferencia,
  formatearPrecio,
  ordenarPorPrecio,
  precioMinimo,
} from '../utils/precios'
import { capitalizar, slug } from '../utils/texto'
import EstadoCarga from './EstadoCarga'
import LogoMarca from './LogoMarca'
import './ListaPrecios.css'

const CARBURANTES = Object.keys(NOMBRES_CARBURANTE) as Carburante[]

type FilaProps = {
  gasolinera: Gasolinera
  carburante: Carburante
  minimo: number | null
  // Puesto en el ranking; las que no venden el carburante no tienen
  posicion?: number
}

function FilaGasolinera({ gasolinera, carburante, minimo, posicion }: FilaProps) {
  const isla = useIsla()
  const precio = gasolinera.precios[carburante]
  const esLaMasBarata = precio !== null && precio === minimo
  const otros = CARBURANTES.filter((c) => c !== carburante && gasolinera.precios[c] !== null)

  return (
    <li className='fila'>
      {posicion !== undefined && <span className='fila-posicion'>{posicion}</span>}
      <span className='fila-logo'>
        <LogoMarca rotulo={gasolinera.rotulo} />
      </span>
      <div className='fila-datos'>
        <div className='fila-nombre'>{gasolinera.rotulo}</div>
        <div className='fila-direccion'>
          {capitalizar(gasolinera.localidad)} · {gasolinera.direccion}
        </div>
        <div className='fila-extra'>
          {otros.map((c) => (
            <span key={c}>
              {NOMBRES_CARBURANTE[c]} {formatearPrecio(gasolinera.precios[c])}
            </span>
          ))}
          <span className='fila-horario'>{gasolinera.horario}</span>
          <Link to={`/${isla.id}/mapa?gasolinera=${gasolinera.id}`}>Ver en el mapa</Link>
        </div>
      </div>
      {precio !== null && (
        <div className='fila-precio'>
          <div className={`fila-precio-valor ${esLaMasBarata ? 'text-success' : ''}`}>
            {formatearPrecio(precio)}
          </div>
          <div className={`fila-precio-nota ${esLaMasBarata ? 'text-success' : ''}`}>
            {esLaMasBarata ? 'Más barata' : formatearDiferencia(precio, minimo)}
          </div>
        </div>
      )}
    </li>
  )
}

type Props = {
  carburante: Carburante
}

// Ranking de gasolineras de la más barata a la más cara para el carburante elegido
function ListaPrecios({ carburante }: Props) {
  const isla = useIsla()
  const { data, error, refetch } = useGasolineras(isla.id)
  const [parametros, setParametros] = useSearchParams()

  const municipios = useMemo(
    () => [...new Set(data?.gasolineras.map((g) => g.municipio))].sort((a, b) => a.localeCompare(b, 'es')),
    [data],
  )
  // ?municipio=tias filtra la lista; así el enlace se puede compartir
  const municipio = municipios.find((m) => slug(m) === parametros.get('municipio')) ?? null

  const gasolineras = useMemo(() => {
    const todas = data?.gasolineras ?? []
    return ordenarPorPrecio(municipio ? todas.filter((g) => g.municipio === municipio) : todas, carburante)
  }, [data, municipio, carburante])
  const minimo = precioMinimo(gasolineras, carburante)

  if (!data) return <EstadoCarga error={error} onReintentar={() => refetch()} />

  const conPrecio = gasolineras.filter((g) => g.precios[carburante] !== null)
  const sinPrecio = gasolineras.filter((g) => g.precios[carburante] === null)
  const nombre = NOMBRES_CARBURANTE[carburante]

  return (
    <div className='lista'>
      <div className='lista-cabecera'>
        <h1 className='h4 mb-0'>
          {nombre} en {municipio ?? isla.nombre}
        </h1>
        <select
          className='form-select form-select-sm'
          aria-label='Municipio'
          value={municipio ? slug(municipio) : ''}
          onChange={(e) => setParametros(e.target.value ? { municipio: e.target.value } : {})}
        >
          <option value=''>Toda la isla</option>
          {municipios.map((m) => (
            <option key={m} value={slug(m)}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <p className='text-muted small mb-3'>
        {conPrecio.length} gasolineras, de la más barata a la más cara
      </p>

      <ol className='lista-filas'>
        {conPrecio.map((g, i) => (
          <FilaGasolinera key={g.id} gasolinera={g} carburante={carburante} minimo={minimo} posicion={i + 1} />
        ))}
      </ol>

      {sinPrecio.length > 0 && (
        <>
          <h2 className='h6 text-muted mt-4'>No venden {nombre.toLowerCase()}</h2>
          <ul className='lista-filas lista-filas-sin-precio'>
            {sinPrecio.map((g) => (
              <FilaGasolinera key={g.id} gasolinera={g} carburante={carburante} minimo={minimo} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default ListaPrecios

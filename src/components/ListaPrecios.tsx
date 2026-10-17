import { useMemo } from 'react'
import { useGasolineras } from '../hooks/useGasolineras'
import { NOMBRES_CARBURANTE, type Carburante } from '../tipos'
import { formatearPrecio, ordenarPorPrecio, precioMinimo } from '../utils/precios'
import EstadoCarga from './EstadoCarga'

const CARBURANTES = Object.keys(NOMBRES_CARBURANTE) as Carburante[]

type Props = {
  carburante: Carburante
}

// Tarjetas de todas las gasolineras, de la más barata a la más cara para el carburante elegido
function ListaPrecios({ carburante }: Props) {
  const { data, error, refetch } = useGasolineras()

  const gasolineras = useMemo(
    () => (data ? ordenarPorPrecio(data.gasolineras, carburante) : []),
    [data, carburante],
  )
  const minimo = useMemo(() => precioMinimo(gasolineras, carburante), [gasolineras, carburante])

  if (!data) return <EstadoCarga error={error} onReintentar={() => refetch()} />

  // El carburante elegido va primero y en negrita
  const otros = CARBURANTES.filter((c) => c !== carburante)

  return (
    <div className='row d-flex flex-row'>
      {gasolineras.map((item) => {
        const esLaMasBarata = minimo !== null && item.precios[carburante] === minimo
        return (
          <div key={item.id} className='col p-2'>
            <div className='card border-secondary mt-2' style={{ width: '300px', height: '320px' }}>
              <div className='card-body text-center'>
                <h6 className='card-title'>{item.rotulo}</h6>
                <h6 className='mb-2 text-muted' style={{ fontSize: '14px' }}>
                  {item.horario}
                </h6>
                <hr />
                <p>{item.localidad}</p>
                <p style={{ fontSize: '14px' }}>{item.direccion}</p>
                <p className={`fw-bold ${esLaMasBarata ? 'text-success' : ''}`}>
                  {NOMBRES_CARBURANTE[carburante]}: {formatearPrecio(item.precios[carburante])}
                </p>
                {otros.map((c) => (
                  <p key={c}>
                    {NOMBRES_CARBURANTE[c]}: {formatearPrecio(item.precios[c])}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ListaPrecios

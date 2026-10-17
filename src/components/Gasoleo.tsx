import { useEffect, useState } from 'react'
import { fetchGasolineras, type Gasolinera } from '../api/gasolineras'
import { esLaMasBarata, ordenarPorPrecio } from '../utils/precios'

const Gasoleo = () => {
  const [gasolineras, setGasolineras] = useState<Gasolinera[]>([])

  useEffect(() => {
    fetchGasolineras().then((lista) => setGasolineras(ordenarPorPrecio(lista, 'Precio Gasoleo A')))
  }, [])

  return (
    <div className='row d-flex flex-row'>
      {gasolineras.map((item) => (
        <div key={item.IDEESS} className='col p-2'>
          <div className='card border-secondary mt-2' style={{ width: '300px', height: '320px' }}>
            <div className='card-body text-center'>
              <h6 className='card-title'>{item['Rótulo']}</h6>
              <h6 className='mb-2 text-muted' style={{ fontSize: '14px' }}>
                {item.Horario}
              </h6>
              <hr />
              <p>Localidad: {item.Localidad}</p>
              <p className='text-lowercase text-capitalize '>Dirección: {item['Dirección']} </p>
              <p
                style={{ fontWeight: 'bold' }}
                className={esLaMasBarata(item, gasolineras, 'Precio Gasoleo A') ? 'text-success' : ''}
              >
                Precio Gasóleo: {item['Precio Gasoleo A']} €
              </p>
              <p className='font-weight-bold'>Precio Gasolina 95: {item['Precio Gasolina 95 E5']} € </p>
              <p className='font-weight-bold'>Precio Gasolina 98: {item['Precio Gasolina 98 E5']} € </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Gasoleo

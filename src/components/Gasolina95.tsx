import { useEffect, useState } from 'react'
import { fetchGasolineras, type Gasolinera } from '../api/gasolineras'
import { esLaMasBarata, ordenarPorPrecio } from '../utils/precios'

const Gasolina95 = () => {
  const [gasolineras, setGasolineras] = useState<Gasolinera[]>([])

  useEffect(() => {
    fetchGasolineras().then((lista) => setGasolineras(ordenarPorPrecio(lista, 'Precio Gasolina 95 E5')))
  }, [])

  return (
    <div className='row d-flex flex-row'>
      {gasolineras.map((item) => (
        <div key={item.IDEESS} className='col d-flex align-content-start flex-wrap p-2'>
          <div className='card border-secondary mt-2' style={{ width: '300px', height: '320px' }}>
            <div className='card-body text-center'>
              <h6 className='card-title'>{item['Rótulo']}</h6>
              <h6 className='mb-2 text-muted' style={{ fontSize: '14px' }}>
                {item.Horario}
              </h6>
              <hr />
              <p>{item.Localidad}</p>
              <p style={{ fontSize: '14px' }}>{item['Dirección']} </p>
              <p
                style={{ fontWeight: 'bold' }}
                className={esLaMasBarata(item, gasolineras, 'Precio Gasolina 95 E5') ? 'text-success' : ''}
              >
                Gasolina 95: {item['Precio Gasolina 95 E5']} €
              </p>
              <p>Gasolina 98: {item['Precio Gasolina 98 E5']} € </p>
              <p>Gasóleo: {item['Precio Gasoleo A']} € </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Gasolina95

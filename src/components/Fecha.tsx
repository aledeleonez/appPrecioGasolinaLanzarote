import { useGasolineras } from '../hooks/useGasolineras'

function Fecha() {
  const { data } = useGasolineras()

  return (
    <footer className='bg-dark text-center text-lg-start' style={{ color: 'white' }}>
      <p className='text-center'>
        Fecha y hora de precios: {data?.fecha} <br />
        Datos obtenidos del{' '}
        <a href='https://sede.serviciosmin.gob.es/es-es/Paginas/Index.aspx'>
          Ministerio de Industria, Comercio y Turismo
        </a>{' '}
        <br />
        Autor: Alejandro de León Fernández 2022
      </p>
    </footer>
  )
}

export default Fecha

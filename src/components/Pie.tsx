import { useGasolineras } from '../hooks/useGasolineras'
import { useIsla } from '../hooks/useIsla'
import { formatearFecha } from '../utils/texto'
import './Pie.css'

function Pie() {
  const { data } = useGasolineras(useIsla().id)

  return (
    <footer className='pie'>
      <div className='pie-contenido'>
        <p>
          {data
            ? `Precios del ${formatearFecha(data.fecha)}. Se actualizan cada media hora.`
            : 'Cargando la hora de los precios...'}
        </p>
        <p>
          Datos obtenidos del{' '}
          <a href='https://sede.serviciosmin.gob.es/es-es/Paginas/Index.aspx'>
            Ministerio de Industria, Comercio y Turismo
          </a>
          . Los precios pueden variar en la gasolinera.
        </p>
        <div className='pie-final'>
          <span>© 2022 Alejandro de León Fernández</span>
          <a href='https://github.com/aledeleonez/PrecioGasolinaCanarias'>Código en GitHub</a>
        </div>
      </div>
    </footer>
  )
}

export default Pie

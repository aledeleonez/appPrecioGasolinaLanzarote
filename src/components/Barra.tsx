import { Link, NavLink } from 'react-router'
import './Barra.css'

const SECCIONES = [
  { ruta: '/', nombre: 'Gasolina 95' },
  { ruta: '/gasolina98', nombre: 'Gasolina 98' },
  { ruta: '/gasoleo', nombre: 'Gasóleo' },
  { ruta: '/mapa', nombre: 'Mapa' },
]

// Barra superior translúcida: el contenido se ve difuminado al pasar por debajo
function Barra() {
  return (
    <header className='barra'>
      <div className='barra-contenido'>
        <Link className='barra-marca' to='/'>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt='' width='28' height='28' />
          <span>Gasolina Lanzarote</span>
        </Link>
        <nav className='barra-secciones' aria-label='Secciones'>
          {SECCIONES.map((s) => (
            <NavLink key={s.ruta} to={s.ruta} end className='barra-seccion'>
              {s.nombre}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Barra

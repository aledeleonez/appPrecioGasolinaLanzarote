import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { guardarIsla, useIsla } from '../hooks/useIsla'
import { cambiarTema, useTema } from '../hooks/useTema'
import { ISLAS, type IdIsla } from '../islas'
import './Barra.css'

// Rutas dentro de cada isla: /lanzarote, /lanzarote/gasolina98...
const SECCIONES = [
  { ruta: '', nombre: 'Gasolina 95' },
  { ruta: '/gasolina98', nombre: 'Gasolina 98' },
  { ruta: '/gasoleo', nombre: 'Gasóleo' },
  { ruta: '/mapa', nombre: 'Mapa' },
]

function IconoSol() {
  return (
    <svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true'>
      <circle cx='12' cy='12' r='4.5' fill='currentColor' />
      <g stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
        <path d='M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8' />
      </g>
    </svg>
  )
}

function IconoLuna() {
  return (
    <svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true'>
      <path d='M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z' fill='currentColor' />
    </svg>
  )
}

// Barra superior translúcida: el contenido se ve difuminado al pasar por debajo
function Barra() {
  const tema = useTema()
  const siguiente = tema === 'oscuro' ? 'claro' : 'oscuro'
  const isla = useIsla()
  const { pathname } = useLocation()
  const navegar = useNavigate()

  // Abre la misma sección en la otra isla. El municipio y la gasolinera
  // elegidos no existen allí, así que no se pasan los parámetros.
  function cambiarIsla(nueva: IdIsla) {
    guardarIsla(nueva)
    const seccion = SECCIONES.find((s) => s.ruta && pathname.startsWith(`/${isla.id}${s.ruta}`))
    navegar(`/${nueva}${seccion?.ruta ?? ''}`)
  }

  return (
    <header className='barra'>
      <div className='barra-contenido'>
        <Link className='barra-marca' to={`/${isla.id}`} aria-label='Gasolina Canarias'>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt='' width='28' height='28' />
          <span>Gasolina Canarias</span>
        </Link>
        <select
          className='barra-isla'
          aria-label='Isla'
          value={isla.id}
          onChange={(e) => cambiarIsla(e.target.value as IdIsla)}
        >
          {ISLAS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nombre}
            </option>
          ))}
        </select>
        <nav className='barra-secciones' aria-label='Secciones'>
          {SECCIONES.map((s) => (
            <NavLink key={s.ruta} to={`/${isla.id}${s.ruta}`} end className='barra-seccion'>
              {s.nombre}
            </NavLink>
          ))}
        </nav>
        <button
          type='button'
          className='barra-tema'
          onClick={() => cambiarTema(siguiente)}
          aria-label={`Cambiar a modo ${siguiente}`}
          title={`Cambiar a modo ${siguiente}`}
        >
          {tema === 'oscuro' ? <IconoSol /> : <IconoLuna />}
        </button>
      </div>
    </header>
  )
}

export default Barra

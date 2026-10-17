import { HashRouter, Link, Route, Routes } from 'react-router'
import Fecha from './components/Fecha'
import GasStationMap from './components/GasStationMap'
import ListaPrecios from './components/ListaPrecios'

// HashRouter porque GitHub Pages no sabe redirigir rutas como /mapa a index.html
function App() {
  return (
    <HashRouter>
      <nav
        className='navbar navbar-expand-lg navbar-dark bg-dark'
        style={{ fontWeight: 'bold', color: 'white' }}
      >
        <Link className='navbar-brand mb-0 h1' to='/'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/2933/2933939.png'
            alt='Inicio'
            width='45'
            height='40'
            className='d-inline-block align-top'
          />
        </Link>
        <span style={{ fontSize: '20px' }}>Precio de la Gasolina en Lanzarote</span>
        <Link to='/' className='nav-link px-3'>
          Gasolina 95
        </Link>
        <Link to='/gasolina98' className='nav-link px-3'>
          Gasolina 98
        </Link>
        <Link to='/gasoleo' className='nav-link px-3'>
          Gasóleo
        </Link>
        <Link to='/mapa' className='nav-link px-3'>
          Mapa
        </Link>
      </nav>
      <div className='bg-light'>
        <Routes>
          <Route
            path='/'
            element={
              <div className='container-md'>
                <ListaPrecios carburante='gasolina95' />
              </div>
            }
          />
          <Route
            path='/gasoleo'
            element={
              <div className='container-md'>
                <ListaPrecios carburante='gasoleo' />
              </div>
            }
          />
          <Route
            path='/gasolina98'
            element={
              <div className='container-md'>
                <ListaPrecios carburante='gasolina98' />
              </div>
            }
          />
          <Route
            path='/mapa'
            element={
              <div className='container-md'>
                <GasStationMap />
              </div>
            }
          />
        </Routes>
      </div>
      <Fecha />
    </HashRouter>
  )
}

export default App

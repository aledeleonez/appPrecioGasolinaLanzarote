import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import EstadoCarga from './components/EstadoCarga'
import Barra from './components/Barra'
import ListaPrecios from './components/ListaPrecios'
import Pie from './components/Pie'

// MapLibre pesa bastante, así que solo se descarga al abrir el mapa
const GasStationMap = lazy(() => import('./components/GasStationMap'))

// Las páginas mapa.html, etc. que genera vite.config.ts hacen que /mapa funcione en GitHub Pages
function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Barra />
      <main>
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
              <Suspense fallback={<EstadoCarga />}>
                <GasStationMap />
              </Suspense>
            }
          />
        </Routes>
      </main>
      <Pie />
    </BrowserRouter>
  )
}

export default App

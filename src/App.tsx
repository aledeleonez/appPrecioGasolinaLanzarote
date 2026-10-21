import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import EstadoCarga from './components/EstadoCarga'
import Barra from './components/Barra'
import ListaPrecios from './components/ListaPrecios'
import Pie from './components/Pie'
import { islaGuardada } from './hooks/useIsla'
import { ISLAS } from './islas'

// MapLibre pesa bastante, así que solo se descarga al abrir el mapa
const GasStationMap = lazy(() => import('./components/GasStationMap'))

// La portada abre la última isla elegida
function IrAIslaGuardada() {
  return <Navigate replace to={`/${islaGuardada()}${useLocation().search}`} />
}

// Antes solo había Lanzarote y las rutas no llevaban isla (/gasoleo?municipio=tias)
function IrALanzarote() {
  const { pathname, search } = useLocation()
  return <Navigate replace to={`/lanzarote${pathname}${search}`} />
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Barra />
      <main>
        <Routes>
          <Route path='/' element={<IrAIslaGuardada />} />
          <Route path='/gasoleo' element={<IrALanzarote />} />
          <Route path='/gasolina98' element={<IrALanzarote />} />
          <Route path='/mapa' element={<IrALanzarote />} />
          {ISLAS.map((isla) => (
            <Route key={isla.id} path={`/${isla.id}`}>
              <Route
                index
                element={
                  <div className='container-md'>
                    <ListaPrecios carburante='gasolina95' />
                  </div>
                }
              />
              <Route
                path='gasoleo'
                element={
                  <div className='container-md'>
                    <ListaPrecios carburante='gasoleo' />
                  </div>
                }
              />
              <Route
                path='gasolina98'
                element={
                  <div className='container-md'>
                    <ListaPrecios carburante='gasolina98' />
                  </div>
                }
              />
              <Route
                path='mapa'
                element={
                  <Suspense fallback={<EstadoCarga />}>
                    {/* La key monta un mapa nuevo al cambiar de isla, encuadrado en ella */}
                    <GasStationMap key={isla.id} />
                  </Suspense>
                }
              />
            </Route>
          ))}
        </Routes>
      </main>
      <Pie />
    </BrowserRouter>
  )
}

export default App

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Fecha from "./components/Fecha";
import Gasoleo from "./components/Gasoleo";
import Gasolina95 from "./components/Gasolina95";
import Gasolina98 from "./components/Gasolina98";
import GasStationMap from "./components/GasStationMap";

function App() {
  return (
    <Router>
      <nav
        className='navbar navbar-expand-lg navbar-dark bg-dark'
        style={{ fontWeight: "bold", color: "white" }}
      >
        <a className='navbar-brand mb-0 h1' href='#'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/2933/2933939.png'
            width='45'
            height='40'
            className='d-inline-block align-top'
          />
        </a>
        <a style={{ fontSize: "20px" }}>Precio de la Gasolina en Lanzarote</a>
        <Link to='/' className='nav-link'>
          Gasolina 95
        </Link>
        <Link to='/gasolina98' className='nav-link'>
          Gasolina 98
        </Link>
        <Link to='/gasoleo' className='nav-link'>
          Gasóleo
        </Link>
        <Link to='/mapa' className='nav-link'>
          Mapa
        </Link>
      </nav>
      <div className='bg-light'>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <div className='container'>
                <Gasolina95 />
              </div>
            }
          />
          <Route
            path='/gasoleo'
            element={
              <div className='container-md'>
                <Gasoleo />
              </div>
            }
          />
          <Route
            exact
            path='/gasolina98'
            element={
              <div className='container-md'>
                <Gasolina98 />
              </div>
            }
          />
          <Route
            exact
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
    </Router>
  );
}

export default App;

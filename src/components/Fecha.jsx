import React, { useEffect, useState }  from 'react';

function Fecha(){

    const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
    const [fecha, setFecha] = useState();

    useEffect(() => {
        obtenerDatos();
    }, [])

    const obtenerDatos = async() => {
        const data = await fetch(url);
        const fecha = await data.json();
        setFecha(fecha.Fecha);
    }

    return(
        <footer className='bg-dark text-center text-lg-start' style={{color: 'white'}}>
            <p className='text-center'>Fecha y hora de precios: {fecha} <br/>
            Datos obtenidos del <a href='https://sede.serviciosmin.gob.es/es-es/Paginas/Index.aspx'>Ministerio de Industria, Comercio y Turismo</a> <br/>
            Autor: Alejandro de León Fernández 2022
            </p>
        </footer>
    );
}

export default Fecha;
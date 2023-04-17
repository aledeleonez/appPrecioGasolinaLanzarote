import React, { useEffect, useState } from 'react';

const Gasoleo = () => {

    const initialUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/';

    const [arrecife, setArrecife] = useState([]);
    const [teguise, setTeguise] = useState([]);
    const [haria, setHaria] = useState([]);
    const [yaiza, setYaiza] = useState([]);
    const [tinajo, setTinajo] = useState([]);
    const [sb, setSb] = useState([]);
    const [tias, setTias] = useState([]);

    useEffect(() => {
        obtenerDatos();
    }, [])

    const obtenerDatos = async() => {
        const data1 = await fetch(initialUrl+'5237');
        const data2 = await fetch(initialUrl+'5256');
        const data3 = await fetch(initialUrl+'5243');
        const data4 = await fetch(initialUrl+'5266');
        const data5 = await fetch(initialUrl+'5261');
        const data6 = await fetch(initialUrl+'5251');
        const data7 = await fetch(initialUrl+'5260');
        const arrecife = await data1.json();
        const teguise = await data2.json();
        const haria = await data3.json();
        const yaiza = await data4.json();
        const tinajo = await data5.json();
        const sb = await data6.json();
        const tias = await data7.json();
        setArrecife(arrecife.ListaEESSPrecio);
        setTeguise(teguise.ListaEESSPrecio);
        setHaria(haria.ListaEESSPrecio);
        setYaiza(yaiza.ListaEESSPrecio);
        setTinajo(tinajo.ListaEESSPrecio);
        setSb(sb.ListaEESSPrecio);
        setTias(tias.ListaEESSPrecio);
    }

    const gasolineras = arrecife.concat(teguise,haria,yaiza,tinajo,sb,tias);

    gasolineras.sort(function(a,b){
        if(a['Precio Gasoleo A'] > b['Precio Gasoleo A']){
            return 1;
        }
        if(a['Precio Gasoleo A'] < b['Precio Gasoleo A']){
            return -1;
        }
        return 0;
    });

    function esIgual(a,b){
        return a == b;
    }


    return (
        <div className='row d-flex flex-row'>
            {gasolineras.map((item,index) => (
                <div key={index} className='col p-2'>
                    <div className='card border-secondary mt-2' style={{width: '300px', height: '320px'}}>
                        <div className='card-body text-center'>
                            <h6 className='card-title'>{item['Rótulo']}</h6>
                            <h6 className='mb-2 text-muted' style={{fontSize: '14px'}}>{item.Horario}</h6>
                            <hr />
                            <p>Localidad: {item.Localidad}</p>
                            <p className='text-lowercase text-capitalize '>Dirección: {item['Dirección']} </p>
                            <p style={{fontWeight: 'bold'}} className={`${esIgual(gasolineras[0]['Precio Gasoleo A'],item['Precio Gasoleo A']) ? 'text-success' : ''}`}>
                                Precio Gasóleo: {item['Precio Gasoleo A']} € 
                            </p>
                            <p className='font-weight-bold'>Precio Gasolina 95: {item['Precio Gasolina 95 E5']} € </p>
                            <p className='font-weight-bold'>Precio Gasolina 98: {item['Precio Gasolina 98 E5']} € </p>    
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Gasoleo;
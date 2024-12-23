import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Componente que renderiza el mapa
const GasStationMap = () => {
  const initialUrl =
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/";

  const [arrecife, setArrecife] = useState([]);
  const [teguise, setTeguise] = useState([]);
  const [haria, setHaria] = useState([]);
  const [yaiza, setYaiza] = useState([]);
  const [tinajo, setTinajo] = useState([]);
  const [sb, setSb] = useState([]);
  const [tias, setTias] = useState([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    const data1 = await fetch(initialUrl + "5237");
    const data2 = await fetch(initialUrl + "5256");
    const data3 = await fetch(initialUrl + "5243");
    const data4 = await fetch(initialUrl + "5266");
    const data5 = await fetch(initialUrl + "5261");
    const data6 = await fetch(initialUrl + "5251");
    const data7 = await fetch(initialUrl + "5260");
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
  };

  const gasolineras = arrecife.concat(teguise, haria, yaiza, tinajo, sb, tias);

  // Definir el icono del marcador
  const logo = (name) => {
    let url = null;
    if (name === "CEPSA") {
      url =
        "https://i.pinimg.com/originals/df/4d/68/df4d68441778462a69557cdf2d48c55b.jpg";
    }
    if (name === "DISA") {
      url = "https://www.disagrupo.es/assets/img/historia/29.png";
    } else {
      url = "https://cdn-icons-png.flaticon.com/512/234/234789.png";
    }
    const gasIcon = new L.Icon({
      iconUrl: url, // Pon la URL del ícono que prefieras
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    return gasIcon;
  };

  return (
    <MapContainer
      center={[28.953055, -13.592706]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {gasolineras.map((item, index) => (
        <Marker
          key={index}
          position={[
            item["Latitud"].replace(",", "."),
            item["Longitud (WGS84)"].replace(",", "."),
          ]}
          icon={logo(item["Rótulo"])}
        >
          <Popup>
            <div>
              <p>Hola</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GasStationMap;

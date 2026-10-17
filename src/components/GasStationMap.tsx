import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { fetchGasolineras, type Gasolinera } from '../api/gasolineras'
import { parseDecimal } from '../utils/precios'

function crearIcono(url: string) {
  return new L.Icon({
    iconUrl: url,
    iconSize: [25, 25],
    // Centro inferior del icono, para que apunte a la posición exacta
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  })
}

const iconos = {
  cepsa: crearIcono('https://i.pinimg.com/originals/df/4d/68/df4d68441778462a69557cdf2d48c55b.jpg'),
  disa: crearIcono('https://www.disagrupo.es/assets/img/historia/29.png'),
  otra: crearIcono('https://cdn-icons-png.flaticon.com/512/234/234789.png'),
}

// El rótulo suele llevar la marca más el nombre de la estación ("DISA COSTA TEGUISE")
function iconoPara(rotulo: string) {
  const marca = rotulo.toUpperCase()
  if (marca.includes('CEPSA')) return iconos.cepsa
  if (marca.includes('DISA')) return iconos.disa
  return iconos.otra
}

// Componente que renderiza el mapa
const GasStationMap = () => {
  const [gasolineras, setGasolineras] = useState<Gasolinera[]>([])

  useEffect(() => {
    fetchGasolineras().then(setGasolineras)
  }, [])

  return (
    <MapContainer
      center={[28.953055, -13.592706]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {gasolineras.map((item) => {
        const latitud = parseDecimal(item.Latitud)
        const longitud = parseDecimal(item['Longitud (WGS84)'])
        if (latitud === null || longitud === null) return null
        return (
          <Marker key={item.IDEESS} position={[latitud, longitud]} icon={iconoPara(item['Rótulo'])}>
            <Popup>
              <div>
                <p>Hola</p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default GasStationMap

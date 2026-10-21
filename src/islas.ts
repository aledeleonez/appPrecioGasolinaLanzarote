// Islas que muestra la web. Cada una tiene su JSON (public/data/<id>.json) y sus
// rutas (/<id>, /<id>/gasoleo...). Los municipios de cada isla están en scripts/minetur.ts

export type IdIsla =
  | 'lanzarote'
  | 'fuerteventura'
  | 'gran-canaria'
  | 'tenerife'
  | 'la-gomera'
  | 'la-palma'
  | 'el-hierro'

export type Isla = {
  id: IdIsla
  nombre: string
  // Rectángulo que encuadra la isla entera en el mapa (longitud, latitud)
  limites: [[number, number], [number, number]]
}

// De este a oeste. La primera es la que se abre si no hay otra elegida.
export const ISLAS: Isla[] = [
  // De Playa Blanca a Órzola
  {
    id: 'lanzarote',
    nombre: 'Lanzarote',
    limites: [
      [-13.88, 28.84],
      [-13.42, 29.24],
    ],
  },
  // De Punta de Jandía a Corralejo
  {
    id: 'fuerteventura',
    nombre: 'Fuerteventura',
    limites: [
      [-14.52, 28.04],
      [-13.82, 28.76],
    ],
  },
  // De La Aldea a Gando y de Maspalomas a La Isleta
  {
    id: 'gran-canaria',
    nombre: 'Gran Canaria',
    limites: [
      [-15.84, 27.73],
      [-15.35, 28.19],
    ],
  },
  // De Teno a Anaga y de Los Cristianos a Bajamar
  {
    id: 'tenerife',
    nombre: 'Tenerife',
    limites: [
      [-16.93, 27.99],
      [-16.11, 28.6],
    ],
  },
  {
    id: 'la-gomera',
    nombre: 'La Gomera',
    limites: [
      [-17.36, 28.01],
      [-17.08, 28.22],
    ],
  },
  {
    id: 'la-palma',
    nombre: 'La Palma',
    limites: [
      [-18.01, 28.45],
      [-17.71, 28.86],
    ],
  },
  {
    id: 'el-hierro',
    nombre: 'El Hierro',
    limites: [
      [-18.17, 27.63],
      [-17.86, 27.86],
    ],
  },
]

export function islaPorId(id: string | null): Isla | null {
  return ISLAS.find((i) => i.id === id) ?? null
}

// "/fuerteventura/gasoleo" → Fuerteventura. Sin isla en la ruta, Lanzarote (la primera)
export function islaDeRuta(ruta: string): Isla {
  return islaPorId(ruta.split('/')[1]) ?? ISLAS[0]
}

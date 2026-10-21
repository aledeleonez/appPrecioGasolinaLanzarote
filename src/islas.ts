// Islas que muestra la web. Cada una tiene su JSON (public/data/<id>.json) y sus
// rutas (/<id>, /<id>/gasoleo...). Los municipios de cada isla están en scripts/minetur.ts

export type IdIsla = 'lanzarote' | 'fuerteventura'

export type Isla = {
  id: IdIsla
  nombre: string
  // Rectángulo que encuadra la isla entera en el mapa (longitud, latitud)
  limites: [[number, number], [number, number]]
}

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
]

export function islaPorId(id: string | null): Isla | null {
  return ISLAS.find((i) => i.id === id) ?? null
}

// "/fuerteventura/gasoleo" → Fuerteventura. Sin isla en la ruta, Lanzarote (la primera)
export function islaDeRuta(ruta: string): Isla {
  return islaPorId(ruta.split('/')[1]) ?? ISLAS[0]
}

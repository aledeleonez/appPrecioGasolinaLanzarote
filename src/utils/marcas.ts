export type Marca = {
  nombre: string
  // Ruta dentro de public/logos; las marcas locales no tienen logo
  logo: string | null
  // Texto que se muestra en el marcador cuando no hay logo
  iniciales: string
}

// El rótulo suele llevar la marca más el nombre de la estación ("DISA COSTA TEGUISE").
// CEPSA pasó a llamarse Moeve en 2024, pero algunas estaciones siguen con el rótulo antiguo.
const MARCAS: { claves: string[]; nombre: string; logo: string }[] = [
  { claves: ['REPSOL'], nombre: 'Repsol', logo: 'repsol.svg' },
  { claves: ['MOEVE', 'CEPSA'], nombre: 'Moeve', logo: 'moeve.svg' },
  { claves: ['DISA'], nombre: 'DISA', logo: 'disa.png' },
  { claves: ['SHELL'], nombre: 'Shell', logo: 'shell.svg' },
  { claves: ['PLENERGY'], nombre: 'Plenergy', logo: 'plenergy.svg' },
  { claves: ['PETROPRIX'], nombre: 'Petroprix', logo: 'petroprix.svg' },
  // Petrolífera Canaria
  { claves: ['PCAN'], nombre: 'PCAN', logo: 'pcan.jpg' },
  // https://tarjetaspl.com/estaciones-de-servicio
  { claves: ['SPL'], nombre: 'SPL', logo: 'spl.png' },
  // https://www.tgas.es/quienes-somos/
  { claves: ['TGAS'], nombre: 'Tgas', logo: 'tgas.jpg' },
  // https://www.combustiblescanarios.com/ (también gestiona la Estación Playa Blanca)
  {
    claves: ['COMBUSTIBLES CANARIOS', 'ESTACION PLAYA BLANCA'],
    nombre: 'Combustibles Canarios',
    logo: 'combustibles-canarios.jpg',
  },
]

// Palabras que no ayudan a identificar la estación
const GENERICAS = new Set(['ESTACION', 'ESTACIÓN', 'GASOLINERA', 'ES', 'E', 'S', 'DE', 'LA', 'EL'])

// "SPL" → "SPL", "TGAS HARÍA" → "TGAS", "COMBUSTIBLES CANARIOS" → "CC"
function iniciales(rotulo: string): string {
  const palabras = rotulo
    .toUpperCase()
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter((p) => p && !GENERICAS.has(p))
  if (palabras.length === 0) return '?'
  if (palabras[0].length <= 4) return palabras[0]
  if (palabras.length === 1) return palabras[0].slice(0, 3)
  return palabras[0][0] + palabras[1][0]
}

export function marcaDe(rotulo: string): Marca {
  const texto = rotulo.toUpperCase()
  // BP va aparte porque "BP" puede aparecer dentro de otras palabras
  if (texto.split(/[^A-Z]+/).includes('BP')) {
    return { nombre: 'BP', logo: 'bp.svg', iniciales: 'BP' }
  }
  const marca = MARCAS.find((m) => m.claves.some((clave) => texto.includes(clave)))
  if (marca) return { nombre: marca.nombre, logo: marca.logo, iniciales: iniciales(marca.nombre) }
  return { nombre: rotulo, logo: null, iniciales: iniciales(rotulo) }
}

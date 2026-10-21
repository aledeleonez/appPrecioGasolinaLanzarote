import { describe, expect, it } from 'vitest'
import { moverArticulo, normalizarEstacion, parseDecimal, type EstacionApi } from './minetur.ts'

const estacion: EstacionApi = {
  IDEESS: '7908',
  'Rótulo': 'DISA',
  Horario: 'L-D: 24H',
  Localidad: 'SAN BARTOLOME',
  Municipio: 'San Bartolomé',
  'Dirección': 'GC-740 a Tinajo km 7,7',
  Latitud: '29,012472',
  'Longitud (WGS84)': '-13,614111',
  'Precio Gasolina 95 E5': '1,598',
  'Precio Gasolina 98 E5': '',
  'Precio Gasoleo A': '1,728',
}

describe('parseDecimal', () => {
  it('convierte la coma decimal', () => {
    expect(parseDecimal('1,459')).toBe(1.459)
    expect(parseDecimal('-13,614111')).toBe(-13.614111)
  })

  it('devuelve null si no hay dato', () => {
    expect(parseDecimal('')).toBeNull()
    expect(parseDecimal('abc')).toBeNull()
  })
})

describe('moverArticulo', () => {
  it('pone delante el artículo que la API deja entre paréntesis', () => {
    expect(moverArticulo('Oliva (La)')).toBe('La Oliva')
    expect(moverArticulo('CASTILLO (EL)')).toBe('EL CASTILLO')
  })

  it('deja igual los nombres sin artículo', () => {
    expect(moverArticulo('Puerto del Rosario')).toBe('Puerto del Rosario')
  })
})

describe('normalizarEstacion', () => {
  it('convierte los textos de la API en números', () => {
    expect(normalizarEstacion(estacion)).toEqual({
      id: '7908',
      rotulo: 'DISA',
      horario: 'L-D: 24H',
      localidad: 'SAN BARTOLOME',
      municipio: 'San Bartolomé',
      direccion: 'GC-740 a Tinajo km 7,7',
      latitud: 29.012472,
      longitud: -13.614111,
      precios: { gasolina95: 1.598, gasolina98: null, gasoleo: 1.728 },
    })
  })

  it('pone el artículo delante en el municipio y la localidad', () => {
    expect(normalizarEstacion({ ...estacion, Municipio: 'Oliva (La)', Localidad: 'OLIVA (LA)' })).toMatchObject({
      municipio: 'La Oliva',
      localidad: 'LA OLIVA',
    })
  })

  it('descarta las estaciones sin coordenadas', () => {
    expect(normalizarEstacion({ ...estacion, Latitud: '' })).toBeNull()
  })
})

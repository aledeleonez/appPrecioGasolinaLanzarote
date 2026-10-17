import { describe, expect, it } from 'vitest'
import type { Gasolinera } from '../api/gasolineras'
import { esLaMasBarata, ordenarPorPrecio, parseDecimal } from './precios'

function gasolinera(id: string, precio98: string): Gasolinera {
  return {
    IDEESS: id,
    'Rótulo': 'TEST',
    Horario: '',
    Localidad: '',
    'Dirección': '',
    Latitud: '29,0',
    'Longitud (WGS84)': '-13,6',
    'Precio Gasolina 95 E5': '',
    'Precio Gasolina 98 E5': precio98,
    'Precio Gasoleo A': '',
  }
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

describe('ordenarPorPrecio', () => {
  const lista = [
    gasolinera('a', '1,709'),
    gasolinera('b', ''),
    gasolinera('c', '1,659'),
    gasolinera('d', '10,000'),
  ]

  it('ordena por valor numérico y deja al final las que no tienen precio', () => {
    const ids = ordenarPorPrecio(lista, 'Precio Gasolina 98 E5').map((g) => g.IDEESS)
    expect(ids).toEqual(['c', 'a', 'd', 'b'])
  })

  it('no modifica la lista original', () => {
    ordenarPorPrecio(lista, 'Precio Gasolina 98 E5')
    expect(lista[0].IDEESS).toBe('a')
  })
})

describe('esLaMasBarata', () => {
  const lista = [gasolinera('a', '1,709'), gasolinera('b', ''), gasolinera('c', '1,659')]

  it('marca solo la de menor precio', () => {
    expect(esLaMasBarata(lista[2], lista, 'Precio Gasolina 98 E5')).toBe(true)
    expect(esLaMasBarata(lista[0], lista, 'Precio Gasolina 98 E5')).toBe(false)
  })

  it('nunca marca una gasolinera sin precio', () => {
    expect(esLaMasBarata(lista[1], lista, 'Precio Gasolina 98 E5')).toBe(false)
  })
})

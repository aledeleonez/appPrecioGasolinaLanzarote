import { describe, expect, it } from 'vitest'
import type { Gasolinera } from '../tipos'
import { formatearPrecio, ordenarPorPrecio, precioMinimo } from './precios'

function gasolinera(id: string, precio98: number | null): Gasolinera {
  return {
    id,
    rotulo: 'TEST',
    horario: '',
    localidad: '',
    direccion: '',
    latitud: 29,
    longitud: -13.6,
    precios: { gasolina95: null, gasolina98: precio98, gasoleo: null },
  }
}

describe('ordenarPorPrecio', () => {
  const lista = [
    gasolinera('a', 1.709),
    gasolinera('b', null),
    gasolinera('c', 1.659),
    gasolinera('d', 10),
  ]

  it('ordena por precio y deja al final las que no tienen precio', () => {
    const ids = ordenarPorPrecio(lista, 'gasolina98').map((g) => g.id)
    expect(ids).toEqual(['c', 'a', 'd', 'b'])
  })

  it('no modifica la lista original', () => {
    ordenarPorPrecio(lista, 'gasolina98')
    expect(lista[0].id).toBe('a')
  })
})

describe('precioMinimo', () => {
  it('ignora las gasolineras sin precio', () => {
    const lista = [gasolinera('a', 1.709), gasolinera('b', null), gasolinera('c', 1.659)]
    expect(precioMinimo(lista, 'gasolina98')).toBe(1.659)
  })

  it('devuelve null si ninguna tiene precio', () => {
    expect(precioMinimo([gasolinera('a', null)], 'gasolina98')).toBeNull()
  })
})

describe('formatearPrecio', () => {
  it('usa coma decimal y tres decimales', () => {
    expect(formatearPrecio(1.459)).toBe('1,459 €')
    expect(formatearPrecio(1.5)).toBe('1,500 €')
  })

  it('indica cuando no hay precio', () => {
    expect(formatearPrecio(null)).toBe('No disponible')
  })
})

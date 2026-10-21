import { describe, expect, it } from 'vitest'
import { islaDeRuta } from './islas'

describe('islaDeRuta', () => {
  it('saca la isla del primer tramo de la ruta', () => {
    expect(islaDeRuta('/fuerteventura').id).toBe('fuerteventura')
    expect(islaDeRuta('/fuerteventura/gasoleo').id).toBe('fuerteventura')
    expect(islaDeRuta('/lanzarote/mapa').id).toBe('lanzarote')
    expect(islaDeRuta('/gran-canaria/gasolina98').id).toBe('gran-canaria')
  })

  it('usa Lanzarote si la ruta no lleva isla', () => {
    expect(islaDeRuta('/').id).toBe('lanzarote')
    expect(islaDeRuta('/gasoleo').id).toBe('lanzarote')
  })
})

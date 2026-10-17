import { describe, expect, it } from 'vitest'
import { capitalizar, formatearFecha, slug } from './texto'

describe('slug', () => {
  it('quita tildes y espacios', () => {
    expect(slug('San Bartolomé')).toBe('san-bartolome')
    expect(slug('Haría')).toBe('haria')
  })
})

describe('capitalizar', () => {
  it('pone en mayúscula cada palabra salvo las cortas del medio', () => {
    expect(capitalizar('PUERTO DEL CARMEN')).toBe('Puerto del Carmen')
    expect(capitalizar('ARRECIFE')).toBe('Arrecife')
    expect(capitalizar('LAS BREÑAS')).toBe('Las Breñas')
  })
})

describe('formatearFecha', () => {
  it('quita los segundos y lo deja legible', () => {
    expect(formatearFecha('17/10/2026 13:19:17')).toBe('17/10/2026 a las 13:19')
  })
})

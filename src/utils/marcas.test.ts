import { describe, expect, it } from 'vitest'
import { marcaDe } from './marcas'

describe('marcaDe', () => {
  it('reconoce la marca aunque el rótulo lleve el nombre de la estación', () => {
    expect(marcaDe('DISA COSTA TEGUISE').logo).toBe('disa.png')
    expect(marcaDe('E.S.DISA YAIZA').logo).toBe('disa.png')
    expect(marcaDe('SHELL ARRECIFE II').logo).toBe('shell.svg')
    expect(marcaDe('MOEVE TAHICHE I').logo).toBe('moeve.svg')
    expect(marcaDe('PCAN ARRIETA').logo).toBe('pcan.jpg')
    expect(marcaDe('SPL').logo).toBe('spl.png')
    expect(marcaDe('TGAS HARÍA').logo).toBe('tgas.jpg')
    expect(marcaDe('COMBUSTIBLES CANARIOS').logo).toBe('combustibles-canarios.jpg')
    expect(marcaDe('ESTACION PLAYA BLANCA').logo).toBe('combustibles-canarios.jpg')
    expect(marcaDe('SANTANA DOMINGUEZ').logo).toBe('santana-dominguez.png')
  })

  it('usa el logo de Repsol para las estaciones H2GO', () => {
    expect(marcaDe('H2GO CORRALEJO')).toMatchObject({ nombre: 'Repsol', logo: 'repsol.svg' })
  })

  it('usa el logo de Moeve para las estaciones con rótulo CEPSA', () => {
    expect(marcaDe('CEPSA')).toMatchObject({ nombre: 'Moeve', logo: 'moeve.svg' })
  })

  it('solo reconoce BP como palabra suelta', () => {
    expect(marcaDe('BP').logo).toBe('bp.svg')
    expect(marcaDe('GASOLINERA BPX').logo).toBeNull()
  })

  it('usa iniciales para las marcas sin logo', () => {
    expect(marcaDe('MARINA RUBICON')).toEqual({ nombre: 'MARINA RUBICON', logo: null, iniciales: 'MR' })
    expect(marcaDe('PETROLERA SUR').iniciales).toBe('PS')
    expect(marcaDe('ABCD NORTE').iniciales).toBe('ABCD')
    expect(marcaDe('ESTACION ROQUE NUBLO').iniciales).toBe('RN')
    expect(marcaDe('DEL VALLE COMBUSTIBLES, S.L.').iniciales).toBe('VC')
  })
})

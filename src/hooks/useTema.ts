import { useSyncExternalStore } from 'react'

export type Tema = 'claro' | 'oscuro'

// Debe coincidir con el script de index.html que aplica el tema antes de pintar
const CLAVE = 'tema'
const sistemaOscuro = window.matchMedia('(prefers-color-scheme: dark)')

function temaGuardado(): Tema | null {
  try {
    const valor = localStorage.getItem(CLAVE)
    return valor === 'claro' || valor === 'oscuro' ? valor : null
  } catch {
    // Navegación privada o almacenamiento bloqueado: se usa el del sistema
    return null
  }
}

function temaDelSistema(): Tema {
  return sistemaOscuro.matches ? 'oscuro' : 'claro'
}

let tema: Tema = temaGuardado() ?? temaDelSistema()
const oyentes = new Set<() => void>()

function aplicar(nuevo: Tema) {
  tema = nuevo
  // Bootstrap 5.3 adapta sus componentes con este atributo y nuestras variables también
  document.documentElement.dataset.bsTheme = nuevo === 'oscuro' ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nuevo === 'oscuro' ? '#000000' : '#f5f5f7')
  oyentes.forEach((avisar) => avisar())
}

// Mientras el usuario no elija uno, se sigue el modo del sistema aunque cambie
sistemaOscuro.addEventListener('change', () => {
  if (!temaGuardado()) aplicar(temaDelSistema())
})

export function cambiarTema(nuevo: Tema) {
  try {
    localStorage.setItem(CLAVE, nuevo)
  } catch {
    // Sin almacenamiento, el cambio dura hasta recargar
  }
  aplicar(nuevo)
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar)
  return () => oyentes.delete(avisar)
}

export function useTema(): Tema {
  return useSyncExternalStore(suscribir, () => tema)
}

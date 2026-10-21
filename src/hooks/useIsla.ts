import { useLocation } from 'react-router'
import { islaDeRuta, islaPorId, ISLAS, type IdIsla, type Isla } from '../islas'

const CLAVE = 'isla'

// La isla va en la ruta (/fuerteventura/gasoleo), así cualquier enlace se puede compartir
export function useIsla(): Isla {
  return islaDeRuta(useLocation().pathname)
}

// La portada abre la última isla elegida en el selector
export function islaGuardada(): IdIsla {
  try {
    return (islaPorId(localStorage.getItem(CLAVE)) ?? ISLAS[0]).id
  } catch {
    // Navegación privada o almacenamiento bloqueado
    return ISLAS[0].id
  }
}

export function guardarIsla(id: IdIsla) {
  try {
    localStorage.setItem(CLAVE, id)
  } catch {
    // Sin almacenamiento, la portada abre siempre la primera isla
  }
}

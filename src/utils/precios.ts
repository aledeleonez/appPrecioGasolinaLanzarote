import type { Carburante, Gasolinera } from '../api/gasolineras'

// Convierte "1,459" en 1.459. Devuelve null si el valor está vacío o no es un número.
export function parseDecimal(valor: string): number | null {
  if (!valor.trim()) return null
  const numero = Number(valor.replace(',', '.'))
  return Number.isNaN(numero) ? null : numero
}

// Ordena de más barata a más cara; las que no venden ese carburante van al final
export function ordenarPorPrecio(gasolineras: Gasolinera[], carburante: Carburante): Gasolinera[] {
  return [...gasolineras].sort((a, b) => {
    const precioA = parseDecimal(a[carburante])
    const precioB = parseDecimal(b[carburante])
    if (precioA === null && precioB === null) return 0
    if (precioA === null) return 1
    if (precioB === null) return -1
    return precioA - precioB
  })
}

export function esLaMasBarata(
  gasolinera: Gasolinera,
  gasolineras: Gasolinera[],
  carburante: Carburante,
): boolean {
  const precio = parseDecimal(gasolinera[carburante])
  if (precio === null) return false
  const precios = gasolineras
    .map((g) => parseDecimal(g[carburante]))
    .filter((p): p is number => p !== null)
  return precio === Math.min(...precios)
}

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

// Precio más bajo de ese carburante, o null si ninguna gasolinera lo vende
export function precioMinimo(gasolineras: Gasolinera[], carburante: Carburante): number | null {
  const precios = gasolineras
    .map((g) => parseDecimal(g[carburante]))
    .filter((p): p is number => p !== null)
  return precios.length > 0 ? Math.min(...precios) : null
}

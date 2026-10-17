import type { Carburante, Gasolinera } from '../tipos'

// Ordena de más barata a más cara; las que no venden ese carburante van al final
export function ordenarPorPrecio(gasolineras: Gasolinera[], carburante: Carburante): Gasolinera[] {
  return [...gasolineras].sort((a, b) => {
    const precioA = a.precios[carburante]
    const precioB = b.precios[carburante]
    if (precioA === null && precioB === null) return 0
    if (precioA === null) return 1
    if (precioB === null) return -1
    return precioA - precioB
  })
}

// Precio más bajo de ese carburante, o null si ninguna gasolinera lo vende
export function precioMinimo(gasolineras: Gasolinera[], carburante: Carburante): number | null {
  const precios = gasolineras
    .map((g) => g.precios[carburante])
    .filter((p): p is number => p !== null)
  return precios.length > 0 ? Math.min(...precios) : null
}

const formatoPrecio = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

// 1.459 → "1,459 €", igual que lo muestra la API
export function formatearPrecio(precio: number | null): string {
  return precio === null ? 'No disponible' : `${formatoPrecio.format(precio)} €`
}

// 1.499 frente a 1.477 → "+0,022 €". null si no hay diferencia que mostrar.
export function formatearDiferencia(precio: number | null, minimo: number | null): string | null {
  if (precio === null || minimo === null) return null
  // Redondeo a milésimas para evitar restos como 0.02199999
  const diferencia = Math.round((precio - minimo) * 1000) / 1000
  return diferencia > 0 ? `+${formatoPrecio.format(diferencia)} €` : null
}

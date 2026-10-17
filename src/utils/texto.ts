// "San Bartolomé" → "san-bartolome", para usarlo en la URL (?municipio=san-bartolome)
export function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}

const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y'])

// La API da las localidades en mayúsculas: "PUERTO DEL CARMEN" → "Puerto del Carmen"
export function capitalizar(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map((palabra, i) =>
      i > 0 && MINUSCULAS.has(palabra) ? palabra : palabra.charAt(0).toUpperCase() + palabra.slice(1),
    )
    .join(' ')
}

// "17/10/2026 13:19:17" (formato de la API) → "17/10/2026 a las 13:19"
export function formatearFecha(fecha: string): string {
  const [dia, hora] = fecha.split(' ')
  return hora ? `${dia} a las ${hora.slice(0, 5)}` : fecha
}

import { useQuery } from '@tanstack/react-query'
import { fetchGasolineras } from '../api/gasolineras'

// Una sola consulta compartida por todas las vistas: al cambiar de pestaña
// se reutilizan los datos en caché en vez de volver a descargarlos.
export function useGasolineras() {
  return useQuery({
    queryKey: ['gasolineras'],
    queryFn: fetchGasolineras,
    // El JSON se regenera cada media hora
    staleTime: 5 * 60 * 1000,
  })
}

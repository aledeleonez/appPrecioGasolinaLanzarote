import { useQuery } from '@tanstack/react-query'
import { fetchGasolineras } from '../api/gasolineras'
import type { IdIsla } from '../islas'

// Una consulta por isla compartida por todas las vistas: al cambiar de pestaña
// se reutilizan los datos en caché en vez de volver a descargarlos.
export function useGasolineras(isla: IdIsla) {
  return useQuery({
    queryKey: ['gasolineras', isla],
    queryFn: () => fetchGasolineras(isla),
    // El JSON se regenera cada media hora
    staleTime: 5 * 60 * 1000,
  })
}

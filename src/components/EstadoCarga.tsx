type Props = {
  error: Error | null
  onReintentar: () => void
}

// Lo que se muestra mientras llegan los datos o si no se pueden cargar
function EstadoCarga({ error, onReintentar }: Props) {
  if (error) {
    return (
      <div className='alert alert-danger my-4 text-center' role='alert'>
        <p>No se han podido cargar los precios. Comprueba tu conexión e inténtalo de nuevo.</p>
        <button type='button' className='btn btn-outline-danger' onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className='d-flex justify-content-center my-5'>
      <div className='spinner-border text-secondary' role='status'>
        <span className='visually-hidden'>Cargando precios...</span>
      </div>
    </div>
  )
}

export default EstadoCarga

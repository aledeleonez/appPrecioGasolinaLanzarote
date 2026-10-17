import { marcaDe } from '../utils/marcas'
import './LogoMarca.css'

type Props = {
  rotulo: string
}

// Logo de la marca, o sus siglas si no tiene logo. Ocupa todo su contenedor.
function LogoMarca({ rotulo }: Props) {
  const marca = marcaDe(rotulo)
  if (marca.logo) {
    return (
      <img
        className='logo-marca'
        src={`${import.meta.env.BASE_URL}logos/${marca.logo}`}
        alt=''
        loading='lazy'
      />
    )
  }
  return <span className='logo-marca logo-marca-iniciales'>{marca.iniciales}</span>
}

export default LogoMarca

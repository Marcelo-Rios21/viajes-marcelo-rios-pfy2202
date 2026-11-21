import { Link, useParams } from 'react-router'

function DetalleDestino() {
  const { id } = useParams()

  return (
    <section>
      <h1>Detalle del destino</h1>
      <p>Identificador seleccionado: {id}</p>
      <p>Aquí se mostrarán los vuelos y hoteles mediante GraphQL.</p>
      <Link to="/">Volver a destinos</Link>
    </section>
  )
}

export default DetalleDestino
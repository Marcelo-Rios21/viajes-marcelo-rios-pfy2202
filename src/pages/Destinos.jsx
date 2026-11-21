import { Link } from 'react-router'

function Destinos() {
  return (
    <section>
      <h1>Destinos disponibles</h1>
      <p>Aquí se mostrarán los destinos obtenidos mediante REST.</p>
      <Link to="/destinos/demo">Probar navegación al detalle</Link>
    </section>
  )
}

export default Destinos
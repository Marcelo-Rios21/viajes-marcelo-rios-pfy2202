import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

const consultaGraphQL = `
  query OpcionesDestino($id: ID!) {
    vuelos(destinoId: $id) {
      id
      aerolinea
      precio
      fechaSalida
      fechaLlegada
      disponible
    }
    hoteles(destinoId: $id) {
      id
      nombre
      precioPorNoche
      fechaEntrada
      fechaSalida
      disponible
    }
  }
`

const formatoPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

function DetalleDestino() {
  const { id } = useParams()
  const [vuelos, setVuelos] = useState([])
  const [hoteles, setHoteles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function cargarOpciones() {
      setCargando(true)
      setError('')
      setVuelos([])
      setHoteles([])

      try {
        const respuesta = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: consultaGraphQL,
            variables: { id },
          }),
          signal: controller.signal,
        })

        if (!respuesta.ok) {
          throw new Error('Error HTTP al consultar GraphQL')
        }

        const resultado = await respuesta.json()

        if (
          resultado.errors?.length ||
          !Array.isArray(resultado.data?.vuelos) ||
          !Array.isArray(resultado.data?.hoteles)
        ) {
          throw new Error('Respuesta GraphQL no valida')
        }

        if (!controller.signal.aborted) {
          setVuelos(resultado.data.vuelos)
          setHoteles(resultado.data.hoteles)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('No se pudieron cargar los vuelos y hoteles. Verifica que GraphQL este disponible.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarOpciones()

    return () => controller.abort()
  }, [id])

  return (
    <section>
      <h1>Detalle del destino</h1>
      <p>Destino seleccionado: {id}</p>

      {cargando && <p>Cargando vuelos y hoteles...</p>}

      {error && <p role="alert">{error}</p>}

      {!cargando && !error && (
        <>
          <h2>Vuelos disponibles para consultar</h2>

          {vuelos.length === 0 ? (
            <p>No se encontraron vuelos para este destino.</p>
          ) : (
            <ul>
              {vuelos.map((vuelo) => (
                <li key={vuelo.id}>
                  <h3>{vuelo.aerolinea}</h3>
                  <p>Precio: {formatoPrecio.format(vuelo.precio)}</p>
                  <p>Salida: {vuelo.fechaSalida}</p>
                  <p>Llegada: {vuelo.fechaLlegada}</p>
                  <p>Disponibilidad: {vuelo.disponible ? 'Disponible' : 'No disponible'}</p>
                </li>
              ))}
            </ul>
          )}

          <h2>Hoteles</h2>

          {hoteles.length === 0 ? (
            <p>No se encontraron hoteles para este destino.</p>
          ) : (
            <ul>
              {hoteles.map((hotel) => (
                <li key={hotel.id}>
                  <h3>{hotel.nombre}</h3>
                  <p>Precio por noche: {formatoPrecio.format(hotel.precioPorNoche)}</p>
                  <p>Entrada: {hotel.fechaEntrada}</p>
                  <p>Salida: {hotel.fechaSalida}</p>
                  <p>Disponibilidad: {hotel.disponible ? 'Disponible' : 'No disponible'}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link to="/">Volver a destinos</Link>
    </section>
  )
}

export default DetalleDestino
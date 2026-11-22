import { useEffect, useState } from 'react'
import { Link, useLocation,useParams } from 'react-router'
import EstadoDisponibilidad from '../components/EstadoDisponibilidad.jsx'

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
  const { state } = useLocation()
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
        const respuesta = await fetch(import.meta.env.VITE_API_BASE_URL + '/graphql', {
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
    <section className="pagina">
      <div className="pagina-intro">
        <h1>Vuelos y hoteles</h1>
        <p>
          Opciones de viaje para {state?.nombreDestino ?? 'este destino'}.
        </p>
      </div>

      {cargando && <p role="status">Cargando vuelos y hoteles...</p>}

      {error && <p role="alert">{error}</p>}

      {!cargando && !error && (
        <div className="secciones-opciones">
          <section className="seccion-opciones">
            <h2>Vuelos</h2>

            {vuelos.length === 0 ? (
              <p>No se encontraron vuelos para este destino.</p>
            ) : (
              <ul className="tarjetas-grid">
                {vuelos.map((vuelo) => (
                  <li key={vuelo.id} className="tarjeta">
                    <div className="opcion-cabecera">
                      <h3 className="opcion-nombre">{vuelo.aerolinea}</h3>
                      <EstadoDisponibilidad disponible={vuelo.disponible} />
                    </div>

                    <dl className="opcion-datos">
                      <div>
                        <dt>Precio</dt>
                        <dd>{formatoPrecio.format(vuelo.precio)}</dd>
                      </div>
                      <div>
                        <dt>Fecha de salida</dt>
                        <dd>{vuelo.fechaSalida}</dd>
                      </div>
                      <div>
                        <dt>Fecha de llegada</dt>
                        <dd>{vuelo.fechaLlegada}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="seccion-opciones">
            <h2>Hoteles</h2>

            {hoteles.length === 0 ? (
              <p>No se encontraron hoteles para este destino.</p>
            ) : (
              <ul className="tarjetas-grid">
                {hoteles.map((hotel) => (
                  <li key={hotel.id} className="tarjeta">
                    <div className="opcion-cabecera">
                      <h3 className="opcion-nombre">{hotel.nombre}</h3>
                      <EstadoDisponibilidad disponible={hotel.disponible} />
                    </div>

                    <dl className="opcion-datos">
                      <div>
                        <dt>Precio por noche</dt>
                        <dd>{formatoPrecio.format(hotel.precioPorNoche)}</dd>
                      </div>
                      <div>
                        <dt>Fecha de entrada</dt>
                        <dd>{hotel.fechaEntrada}</dd>
                      </div>
                      <div>
                        <dt>Fecha de salida</dt>
                        <dd>{hotel.fechaSalida}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <Link className="enlace-volver" to="/">
        Volver a destinos
      </Link>
    </section>
  )
}

export default DetalleDestino
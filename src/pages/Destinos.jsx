import { useEffect, useState } from 'react'
import { Link } from 'react-router'

function Destinos() {
  const [destinos, setDestinos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function cargarDestinos() {
      try {
        const respuesta = await fetch('http://localhost:3000/destinos', {
          signal: controller.signal,
        })

        if (!respuesta.ok) {
          throw new Error('Error al consultar los destinos')
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos)) {
          throw new Error('Formato de destinos no valido')
        }

        setDestinos(datos)
      } catch {
        if (!controller.signal.aborted) {
          setError('No se pudieron cargar los destinos. Verifica que la API REST este disponible.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarDestinos()

    return () => controller.abort()
  }, [])

  return (
    <section>
      <h1>Destinos disponibles</h1>

      {cargando && <p>Cargando destinos...</p>}

      {error && <p role="alert">{error}</p>}

      {!cargando && !error && destinos.length === 0 && (
        <p>No hay destinos disponibles.</p>
      )}

      {!cargando && !error && destinos.length > 0 && (
        <ul>
          {destinos.map((destino) => (
            <li key={destino.id}>
              <h2>{destino.nombre}</h2>
              <p>País: {destino.pais}</p>

              <h3>Actividades populares</h3>
              <ul>
                {destino.actividadesPopulares.map((actividad) => (
                  <li key={actividad}>{actividad}</li>
                ))}
              </ul>

              <Link to={`/destinos/${destino.id}`}>
                Ver detalle del destino
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Destinos
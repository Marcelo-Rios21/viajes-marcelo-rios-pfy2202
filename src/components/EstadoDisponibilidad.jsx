function EstadoDisponibilidad({ disponible }) {
  return (
    <span
      className={`estado-disponibilidad ${
        disponible ? 'estado-disponible' : 'estado-no-disponible'
      }`}
    >
      {disponible ? 'Disponible' : 'No disponible'}
    </span>
  )
}

export default EstadoDisponibilidad
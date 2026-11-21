import { Link, Routes, Route } from 'react-router'
import Destinos from './pages/Destinos.jsx'
import DetalleDestino from './pages/DetalleDestino.jsx'
import './App.css'

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Agencia de Viajes</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Destinos />} />
          <Route path="/destinos/:id" element={<DetalleDestino />} />
        </Routes>
      </main>
    </>
  )
}

export default App
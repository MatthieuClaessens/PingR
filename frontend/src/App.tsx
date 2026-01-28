import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthenticationPage from './pages/auth/AuthenticationPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/app" element={<div>Espace Membre (en construction)</div>} />
      </Routes>
    </Router>
  )
}

export default App
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthenticationPage from './pages/auth/AuthenticationPage'
import HomePage from './pages/home/HomePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/home" element={<HomePage/>} />
      </Routes>
    </Router>
  )
}

export default App
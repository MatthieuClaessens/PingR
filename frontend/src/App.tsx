import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthenticationPage from './auth/pages/AuthenticationPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthenticationPage/>
    </>
  )
}

export default App

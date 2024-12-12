import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Game from './pages/Game'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { tokenRequest } from './api/auth'
import { connectSocket } from './utils/socket'

const App: React.FC = () => {
  useEffect(() => {

    const getToken = async () => { 
      try {
        const [ response, data ] = await tokenRequest()
        if (response.ok) {
          const socket = connectSocket(data.accessToken)
        }

      } catch (error) {
        return
      }
    }

    getToken()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/:room/:username' element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App

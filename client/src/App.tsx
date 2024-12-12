import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Game from './pages/Game'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import { connectSocket } from './utils/socket'

const App: React.FC = () => {
  connectSocket()
  
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

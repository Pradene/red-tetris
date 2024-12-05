import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Nav from './components/Nav'
import Home from './pages/Home'
import Game from './pages/Game'

import logo from './assets/logo.svg'

import './App.css'

import socket from './utils/socket'


function App() {
  const s = useRef(socket)

  useEffect(() => {
    const currentSocket = s.current

    currentSocket.connect()

    currentSocket.on("connect", () => {
      console.log("Connected to socket.io server:", socket.id)
    })

    currentSocket.on("game_started", (data) => {
      console.log("Received message:", data)
    })

    currentSocket.on("game_state", (data) => {
      console.log("Received message:", data)
    })

    currentSocket.emit("create_game", "Hello you")

    return () => {
      currentSocket.disconnect()
    }
  }, [])

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  )
}

export default App

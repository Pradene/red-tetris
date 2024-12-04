import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Nav from './components/Nav'
import Home from './pages/Home'
import Game from './pages/Game'

import logo from './assets/logo.svg'
import './App.css'

function App() {
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

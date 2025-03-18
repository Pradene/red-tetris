import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from './store/store'

import { checkAuth } from './store/authThunk'
import { useSelector } from 'react-redux'

import LoadingScreen from './components/LoadingScreen'
import Matchmaking from './pages/Matchmaking'
import Game from './pages/Game'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

const AuthRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/matchmaking/:mode" element={<Matchmaking /> } />
            <Route path='/:room/:username' element={<Game />} />
            <Route path='/' element={<Home />} />
            <Route path='*' element={<Navigate to="/" replace />} />
          </Route>

          <Route element={<AuthRoute />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Route>
      </Routes>
    </Router>
  )
}

export default App

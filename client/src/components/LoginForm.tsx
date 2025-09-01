import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { loginRequest } from '../api/auth'
import { connectSocket } from '../utils/socket'
import { AppDispatch } from '../store/store'
import { setAuthenticated } from '../store/authReducer'

// import styles from "./LoginForm.module.css"

const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()

    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (inputRef.current) {
          inputRef.current.focus()
      }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setIsLoading(true)

      try {
          const [response, data] = await loginRequest(username, password)
          
          if (response.ok) {
            dispatch(setAuthenticated({
                id: data.user.id,
                username: data.user.username
            }))

            connectSocket()
            navigate("/")
          } else {
            // Handle different error scenarios
            let errorMessage = 'Login failed. Please try again.'
            
            if (response.status === 401) {
                errorMessage = 'Invalid username or password.'
            } else if (response.status === 429) {
                errorMessage = 'Too many login attempts. Please try again later.'
            } else if (response.status >= 500) {
                errorMessage = 'Server error. Please try again later.'
            } else if (data?.message) {
                errorMessage = data.message
            }
            
            setError(errorMessage)
          }
      } catch (err) {
          // Handle network errors or other exceptions
          setError('Network error. Please check your connection and try again.')
          console.error('Login error:', err)
      } finally {
          setIsLoading(false)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="" style={{textAlign: "center"}}>
          <h1 className="">Welcome Back!</h1>

          {error && (
            <div style={{
                color: '#ff6b6b',
                backgroundColor: '#ffe0e0',
                border: '1px solid #ffb3b3',
                borderRadius: '0.125rem',
                padding: '0.5rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.9rem'
            }}>
                {error}
            </div>
          )}

          <div className="">
                <input
                    style={{width: "100%", marginBottom: "0.5rem"}}
                    type="text"
                    placeholder="Name"
                    value={username}
                    ref={inputRef}
                    onChange={(e) => setUsername(e.target.value)}
                    className=""
                    required
                    disabled={isLoading}
                />
          </div>

          <div className="">
                <input
                    style={{width: "100%", marginBottom: "0.5rem"}}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=""
                    required
                    disabled={isLoading}
                />
          </div>

          <button
            type="submit"
            className="button"
            style={{
                width: "100%", 
                padding: "0.5rem 1rem",
                borderRadius: '0.125rem',
                margin: "0.5rem 0rem",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="">
            Don't have an account?
            <button
                type="button"
                onClick={() => navigate("/register")}
                className=""
                disabled={isLoading}
            >Sign Up</button>
          </p>
      </form>
    )
}

export default LoginForm
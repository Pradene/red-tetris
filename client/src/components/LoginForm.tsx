import React, { useState, useRef, useEffect } from 'react'
import { loginRequest } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { connectSocket } from '../utils/socket'
import styles from "./LoginForm.module.css"

const LoginForm: React.FC = () => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const [response, data] = await loginRequest(username, password)
    if (response.ok) {
      connectSocket(data.accessToken)
      navigate("/")

    } else {
      console.error("Error: ", data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="" style={{textAlign: "center"}}>
      <h1 className="">Welcome Back!</h1>
      
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
          />
      </div>
      
      <button
        type="submit"
        className="button"
        style={{width: "100%", margin: "0.5rem 0rem"}}
      >
        Log In
      </button>
      
      <p className="">
        Don't have an account?
        <button
          type="button"
          onClick={() => navigate("/register")}
          className=""
        
        >Sign Up</button>
      </p>
    </form>
  )
}

export default LoginForm
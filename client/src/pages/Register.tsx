import React, { useState, useRef, useEffect } from 'react'
import { registerRequest } from '../api/auth'
import { useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const navigate = useNavigate()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirmation) {
        console.error("Password confirmation failed")
        return
    }

    const [response, data] = await registerRequest(username, password)
    if (response.ok) {
      navigate("/login")

    } else {
      console.error("Error: ", data)
    }
  }

  return (
    <div style={{
        display: "grid",
        placeItems: "center",
        height: "100%"
    }}>
        <form onSubmit={handleSubmit} className="" style={{textAlign: "center"}}>
          <h1 className="">Join us!</h1>

          <div className="">
              <input
                  style={{width: "100%", marginBottom: "0.5rem"}}
                  type="text"
                  placeholder="Name"
                  ref={inputRef}
                  value={username}
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

          <div className="">
              <input
                  style={{width: "100%", marginBottom: "0.5rem"}}
                  type="password"
                  placeholder="Password Confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className=""
                  required
                />
          </div>

          <button
            type="submit"
            className="button"
            style={{width: "100%", margin: "0.5rem 0rem"}}
            >
            Sign up
          </button>

          <p className="">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className=""

              >Log in</button>
          </p>
        </form>
    </div>
  )
}

export default Register
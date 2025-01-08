import React from "react"
import LoginForm from "../components/LoginForm"

const Login: React.FC = () => {
    return (
        <div style={{
            display: "grid",
            placeItems: "center",
            height: "100%"
        }}>
            <LoginForm />
        </div>
    )
}

export default Login
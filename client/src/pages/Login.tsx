import React from "react"
import LoginForm from "../components/LoginForm"

const Login: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh"
        }}>
            <LoginForm />
        </div>
    )
}

export default Login
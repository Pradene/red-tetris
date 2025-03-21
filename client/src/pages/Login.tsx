import React from "react"
import LoginForm from "../components/LoginForm"

import styles from "./Login.module.css"

const Login: React.FC = () => {
    return (
        <div className={styles.login}>
            <LoginForm />
        </div>
    )
}

export default Login
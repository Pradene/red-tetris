import React from "react"
import { Link } from "react-router-dom"
import LogoutButton from "./LogoutButton"

import styles from "./Nav.module.css"

const Nav: React.FC = () => {
    return (
        <nav className={styles.nav}>
            <Link to="/" style={{textDecoration: "none"}}>
                <h1 className={styles.title}>Tetris</h1>
            </Link>
            <LogoutButton />
        </nav>
    )
}

export default Nav
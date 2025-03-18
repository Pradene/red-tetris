import React from "react"
import LogoutButton from "./LogoutButton"

import styles from "./Nav.module.css"

const Nav: React.FC = () => {
    return (
        <nav className={styles.nav}>
            <h1 className={styles.title}>Tetris</h1>
            <LogoutButton />
        </nav>
    )
}

export default Nav
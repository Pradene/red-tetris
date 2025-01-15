import React from "react"
import { Link } from "react-router-dom"

const Nav: React.FC = () => {
	return (
		<nav>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/game">Games</Link></li>
			</ul>
		</nav>
	)
}

export default Nav
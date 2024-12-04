import React from "react"
import { Link } from "react-router-dom"

function Nav() {
	return (
		<nav>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/game">Games</Link></li>
				{/* <li><Link to="/chat">Chat</Link></li> */}
				{/* <li><Link to="/profile">Profile</Link></li> */}
				{/* <li><Link to="/settings">Settings</Link></li> */}
			</ul>
		</nav>
	)
}

export default Nav
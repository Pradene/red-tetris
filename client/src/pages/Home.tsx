import React, { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

const Home: React.FC = () => {
	const [ room, setRoom ] = useState("")
	const [ username, setUsername ] = useState("")
	const navigate = useNavigate()

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		joinRoom()
	}

	const joinRoom = () => {
		if (!room || !username) {
			console.error("Enter username and room")
			return
		}

		navigate(`/${room}/${username}`)
	}

	return (
		<div style={{
			width: "100%",
			height: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}>
			<form style={{
				display: "flex",
				gap: "1rem",
				flexDirection: "column"
			}} onSubmit={handleSubmit}>
				<input 
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}/>
				<input
					type="text"
					placeholder="Room"
					value={room}
					onChange={(e) => setRoom(e.target.value)}/>
				<button type="submit">Join / create game</button>
			</form>
		</div>
	)
}

export default Home
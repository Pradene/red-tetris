import React, { FormEvent, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../store/store"
import LogoutButton from "../components/LogoutButton"

const Home: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user)
	const [ room, setRoom ] = useState("")
	const navigate = useNavigate()

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		joinRoom()
	}

	const joinRoom = () => {
		if (!room) {
			console.error("Enter a room name")
			return
		} else if (user?.username === undefined) {
			console.error("Couldn't not find connected user")
			return
		}

		navigate(`/${room}/${user?.username}`)
	}

	return (
		<div style={{
			width: "100%",
			height: "100vh",
			display: "flex",
			gap: "2rem",
			flexDirection: "column",
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
					placeholder="Room"
					value={room}
					onChange={(e) => setRoom(e.target.value)}/>
				<button type="submit">Join / create game</button>
			</form>
			<LogoutButton />
		</div>
	)
}

export default Home
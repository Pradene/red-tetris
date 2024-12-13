import React from "react"
import { logoutRequest } from "../api/auth"
import { useDispatch } from "react-redux"
import { setUnauthenticated } from "../store/authReducer"
import { useNavigate } from "react-router-dom"

const LogoutButton: React.FC = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		const [response, data] = await logoutRequest()
		if (response.ok) {
			dispatch(setUnauthenticated())
			navigate("/login")

		} else {
			console.error("Error during logout:", data.message)
		}
	}

	return (
		<button onClick={handleLogout}>Log out</button>
	)
}

export default LogoutButton
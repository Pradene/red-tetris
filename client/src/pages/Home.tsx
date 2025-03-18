import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../store/store"

import { GameMode } from "../types/define"

import Nav from "../components/Nav"

import styles from "./Home.module.css"

const Home: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate();

	const joinGame = (mode: GameMode) => {
		if (!mode) {
		  console.error("Select a game mode");
		  return;
		}
	
		if (!user?.username) {
		  console.error("User not authenticated");
		  return;
		}
	
		switch(mode) {
		  case 'solo':
			navigate(`/solo/${user.username}`);
			break;
	
		  case 'multiplayer':
		  case 'survival':
			navigate(`/matchmaking/${mode}`);
			break;
		}
	  };

	return (
		<>
			<Nav />
			<div className={styles.home}>
				<button type="button" className={styles.gameButton} onClick={() => joinGame("multiplayer")}>Multiplayer</button>
				<button type="button" className={styles.gameButton} onClick={() => joinGame("survival")}>Survival</button>
				<button type="button" className={styles.gameButton} onClick={() => joinGame("solo")}>Solo</button>
			</div>
		</>
	)
}

export default Home;
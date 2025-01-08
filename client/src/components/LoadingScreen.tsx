import React from "react"

const LoadingScreen: React.FC = () => {
	return (
		<div style={{
			display: "grid",
			placeItems: "center",
			width: "100%",
			height: "100%",
		}}>
			<p>loading...</p>
		</div>
	)
}

export default LoadingScreen
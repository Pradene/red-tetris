import { User, GameMode } from "../types/define";

export const matchmakingRequest = async (mode: GameMode, user: User) => {
    const body = JSON.stringify({
        username: user?.username,
        userId: user?.id
    });
    
    const response = await fetch(
        `http://localhost:5000/api/matchmaking/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: body,
        }
    );

    const data = await response.json();

    return [response, data];
}
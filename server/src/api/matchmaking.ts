import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

type GameMode = "multiplayer" | "survival";

function isGameMode(mode: string): boolean {
    return ["multiplayer", "survival"].includes(mode);
}

interface GameRoom {
  id: string;
  mode: GameMode;
  players: string[];
  status: "waiting" | "ready";
}

const activeRooms: GameRoom[] = [];

router.post("/:mode", async (req, res) => {
    console.log(`Received request for mode: ${req.params.mode}`);

    const { mode } = req.params;
    const { username, userId } = req.body;

    console.log(username);

    try {
        // Find existing room with capacity
        let room = activeRooms.find(room => 
            room.mode === mode && 
            room.status === "waiting" &&
            (mode === "multiplayer" ? room.players.length < 2 : room.players.length < 4)
        );

        if (!room) {
            if (!isGameMode(mode)) {
                res.status(400).json({ error: "Mode is not a valid mode"});
                return ;
            }

            room = {
                id: uuidv4(),
                mode: mode as GameMode,
                players: [userId],
                status: "waiting"
            };

            activeRooms.push(room);
        
        } else {
            // Add player to existing room
            room.players.push(userId);
        
            // Check if room is full
            const isFull =
                (mode === "multiplayer" && room.players.length === 2) ||
                (mode === "survival" && room.players.length === 4);
        
            if (isFull) room.status = "ready";
        }

        console.log(room);

        res.status(200).json({ 
          roomId: room.id,
          estimatedWait: room.status === "ready" ? 0 : 30
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Matchmaking error:`, error);
        res.status(500).json({ error: "Matchmaking failed" });
    }
});

export default router;
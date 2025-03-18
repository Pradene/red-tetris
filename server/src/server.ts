import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import "./config/dotenv";

import initializeDb from "./db/utils/init";

import authRoutes from "./api/auth";
import matchmakingRoutes from "./api/matchmaking";

const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV !== "test") {
	initializeDb();
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	methods: ["GET", "POST"],
	credentials: true,
}));

app.set("trust proxy", true);

app.use("/api/auth", authRoutes);
app.use("/api/matchmaking", matchmakingRoutes);

if (NODE_ENV === "production") {
	const CLIENT_BUILD_FOLDER = path.join(__dirname, "../../client/build");
	app.use(express.static(CLIENT_BUILD_FOLDER));
	app.get("*", (req: Request, res: Response) => {
		res.sendFile(path.join(CLIENT_BUILD_FOLDER, "/index.html"));
	});

} else {
	app.get("*", (req: Request, res: Response) => {
		res.send("React app is not built yet.");
	});
}

export const server = http.createServer(app);
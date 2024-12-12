import express from "express"
import http from "http"
import cors from "cors"
import path from "path"

import cookieParser from "cookie-parser"

import "./config/dotenv"
import authRoutes from "./api/auth/auth"
import initializeDb from "./db/utils/init"

initializeDb()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}))

app.set("trust proxy", true)

app.use("/api/auth", authRoutes)

const CLIENT_BUILD_FOLDER = path.join(__dirname, "../../client/build")
if (process.env.MODE === "production") {
    app.use(express.static(CLIENT_BUILD_FOLDER))
}

app.get("*", (req, res) => {
    if (process.env.MODE === "production") {
        res.sendFile(path.join(CLIENT_BUILD_FOLDER, "/index.html"))
    } else {
        res.send("React app is not built yet.")
    }
})

export const server = http.createServer(app)
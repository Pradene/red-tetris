import express, { Request, Response, NextFunction } from "express"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const CLIENT_BUILD_FOLDER = path.join(__dirname, '../../client/build')

if (process.env.MODE === "production") {
    app.use(express.static(CLIENT_BUILD_FOLDER))
}

app.get('*', (req: Request, res: Response) => {
    if (process.env.MODE === "production") {
        res.sendFile(path.join(CLIENT_BUILD_FOLDER, '/index.html'))

    } else {
        res.send('React app is not built yet.')

    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
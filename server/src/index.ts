import express, { Request, Response, NextFunction } from "express"
import path from "path"

const app = express()
const PORT = 3001

const CLIENT_BUILD_FOLDER = path.join(__dirname, '../../client/build')
app.use(express.static(CLIENT_BUILD_FOLDER))

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(CLIENT_BUILD_FOLDER, '/index.html'))
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
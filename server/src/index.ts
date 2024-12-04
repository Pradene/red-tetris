import express, { Request, Response, NextFunction } from "express"

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
import express, { Request, Response } from 'express';
require("dotenv").config({ path: "./.env" });

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Hello, world!',
    })
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
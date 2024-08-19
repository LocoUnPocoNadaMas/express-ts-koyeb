import express, { Request, Response } from 'express';
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Hello, world again!',
    })
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
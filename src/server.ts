import express from 'express'
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { checkRoles } from './middleware/user.middle';
import dotenv from "dotenv"
const app = express()

dotenv.config();
const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
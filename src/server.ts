import express from 'express'

import dotenv from "dotenv"
import authRoutes from './routes/auth';
const app = express()

dotenv.config();
const port = process.env.PORT || 3000

app.use(express.json());

app.use('/api/v1/auth', authRoutes);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
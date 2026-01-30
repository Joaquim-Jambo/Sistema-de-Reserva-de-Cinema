import express from 'express'
import routes from './routes/routes';
import dotenv from "dotenv"
import { v2 as cloudinary } from 'cloudinary';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const port = process.env.PORT || 3000

app.use(express.json());
app.use('/api/v1', routes)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_CLOUD_SECRET
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
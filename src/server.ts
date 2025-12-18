import express from 'express'
import router from './routes/routes';
import dotenv from "dotenv"

const app = express()

dotenv.config();
const port = process.env.PORT || 3000

app.use(express.json());
app.use('/api/v1', router)



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
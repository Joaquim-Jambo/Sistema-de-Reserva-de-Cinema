import express from 'express'
import type { Request, Response } from 'express';
import { Movie } from './models/movie.model';
import { db } from './db/db';
import { randomUUID } from 'node:crypto';
import { checkRoles } from './middleware/user.middle';
const app = express()

const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/movies', checkRoles(["Admin"]),(req: Request, res: Response) => {
    const { title, description } = req.body;
    const newMovie: Movie = {
        id: randomUUID(),
        title,
        description
    }
    db.movies.push(newMovie);
    res.status(201).json(newMovie);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
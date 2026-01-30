import express from "express"
import { validateBody, validateParams, validateQuery } from "../middlewares";
import { createMovieSchema } from "../schemas/movieSchema";
import { createMovieController, deleteMovieController, getAllMoviesController, getMoviesByFilterController, updateMovieController } from "../controllers/movieController";
import { filterSchema } from "../schemas";


const moviesRoutes = express.Router();

moviesRoutes.post('/', validateBody(createMovieSchema), createMovieController);
moviesRoutes.get('/', validateQuery(filterSchema), getAllMoviesController);
moviesRoutes.put('/:id', validateParams, validateBody, updateMovieController);
moviesRoutes.get('/search', getMoviesByFilterController);
moviesRoutes.delete('/:id', validateParams, deleteMovieController);

export default moviesRoutes;
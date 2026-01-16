import express from "express"
import { validateBody, validateQuery } from "../middlewares";
import { createMovieSchema } from "../schemas/movieSchema";
import { createMovieController, getAllMoviesController } from "../controllers/movieController";
import { filterSchema } from "../schemas";

const moviesRoutes = express.Router();

moviesRoutes.post('/', validateBody(createMovieSchema), createMovieController);
moviesRoutes.get('/', validateQuery(filterSchema), getAllMoviesController);
export default moviesRoutes;
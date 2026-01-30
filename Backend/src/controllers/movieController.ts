import { type Request, type Response } from "express"
import { createMovieSchema, filterMovieSchema, updateMovieSchema } from "../schemas/movieSchema"
import { createMovie, deleteMovie, getAllMovies, getMoviesByFilter, updateMovie } from "../repositories/moviesRepository"
import { uploadImage } from "../service/uploadImageService";
import { filterSchema, idSchema } from "../schemas";
import { moviesFilter } from "../types/movies";
import { movieUpdate } from "../models/movieModel";

export const createMovieController = async (req: Request<{}, {}, createMovieSchema, {}>, res: Response) => {
    try {
        const { title, description, categoryIds, coverImageUrl, trailerVideoUrl, duration, cast, distribuitor, countryOfOrigin, premiereDate, director } = req.body;
        const coverUrl = await uploadImage(coverImageUrl);
        const movie = await createMovie({ coverImageUrl: coverUrl, title, description, categoryIds, trailerVideoUrl, duration, cast, distribuitor, countryOfOrigin, premiereDate, director });
        res.status(201).json(movie);
    } catch (error: any) {
        console.error(error.message)
        if (error.message.includes("Filme ja existente")) {
            return res.status(409).json({
                error: true,
                message: "O filme informado já está cadastrado."
            });
        }
        throw new Error(error.message ? `Erro ao registrar filme: ${error.message}` : "Erro ao registrar a filme");
    }
}

export const getAllMoviesController = async (req: Request<{}, {}, {}, filterSchema>, res: Response) => {
    try {
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const movies = await getAllMovies(page, limit);
        res.status(200).json(movies);
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao registrar filme: ${error.message}` : "Erro ao registrar a filme");
    }
}

export const getMoviesByFilterController = async (req: Request<{}, {}, {}, filterMovieSchema>, res: Response) => {
    try {
        const key = req.query.category ? "category" : "id";
        const filter: Partial<moviesFilter> = {
            [key]: key === "category" ? req.query.category as string : req.query.id as string
        };
        const movies = await getMoviesByFilter(filter);
        res.status(200).json({ data: movies });
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao filtra filme: ${error.message}` : "Erro ao filtrar os filmes");
    }
}

export const updateMovieController = async (req: Request<idSchema, {}, updateMovieSchema, {}>, res: Response) => {
    try {
        const data: movieUpdate = {
            ...req.body
        }
        const id = req.params.id;
        const movieUpdated = await updateMovie(data, id);
        res.status(200).json(movieUpdated);
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao filtra filme: ${error.message}` : "Erro ao filtrar os filmes");
    }
}
export const deleteMovieController = async (req: Request<idSchema>, res: Response) => {
    try {
        const id = req.params.id;
        await deleteMovie(id);
        res.status(204).send();
    } catch (error: any) {
        console.error(error.message);
        throw new Error("Erro ao eliminar o filme");
    }
}
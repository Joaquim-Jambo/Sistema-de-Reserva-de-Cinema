import prisma from "../config/prismaClient";
import { filterGeneric } from "../models";
import { movie } from "../models/movieModel";
import { filter } from "../types/session";
import { verifyExist } from "../utils";

export const createMovie = async (data: movie) => {
    try {
        const movieExist = await verifyExist({ title: data.title });
        if (movieExist)
            throw new Error("Filme ja existente");
        const movie = await prisma.movie.create({
            data: {
                title: data.title,
                description: data.description,
                coverImageUrl: data.coverImageUrl,
                //associar categorias
                movieCategories: {
                    create: data.categoryIds.map((categoryId) => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                }
            },
            include: { movieCategories: true, sessions: true }
        })
        return movie;
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message ? `Erro ao registra o filme: ${error.message}` : "Erro ao registrar o filme");
    }
}

export const getAllMovies = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;

        const [movies, total] = await Promise.all([
            prisma.movie.findMany({
                skip,
                take: limit,
                orderBy: { title: 'asc' },
                include: { movieCategories: true }
            }),
            prisma.movie.count()
        ])
        const moviesWithCategoriesId = movies.map((movie) => ({
            ...movie,
            categoryIds: movie.movieCategories.map((mc) => mc.categoryId)
        })
        );
        const response: filterGeneric<movie[]> = {
            data: moviesWithCategoriesId,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
            }
        }
        return (response);
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message ? `Erro ao listar os filme: ${error.message}` : "Erro ao listar os filme");
    }
}

// export const getMoviesByFilter = 
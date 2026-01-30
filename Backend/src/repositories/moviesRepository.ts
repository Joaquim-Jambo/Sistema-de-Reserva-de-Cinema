import prisma from "../config/prismaClient";
import { filterGeneric } from "../models";
import { movie, movieUpdate} from "../models/movieModel";
import { uploadImage } from "../service/uploadImageService";
import { filterMovies, moviesFilter } from "../types/movies";
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
                },
                duration: data.duration,
                cast: data.cast,
                premiereDate: data.premiereDate,
                director: data.director,
                countryOfOrigin: data.countryOfOrigin,
                trailerVideoUrl: data.trailerVideoUrl,
                distribuitor: data.distribuitor
            },
            include: { movieCategories: { include: { category: true } }, sessions: true }
        })
        const mapped = {
            ...movie,
            categoryIds: movie.movieCategories.map((mc) => mc.categoryId),
            categories: movie.movieCategories.map((mc) => mc.category ? { id: mc.category.id, name: mc.category.name } : { id: mc.categoryId, name: '' })
        }
        return mapped;
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
                include: { movieCategories: { include: { category: true } } },
            }),
            prisma.movie.count()
        ])
        const moviesWithCategories = movies.map((movie) => ({
            ...movie,
            categoryIds: movie.movieCategories.map((mc) => mc.categoryId),
            categories: movie.movieCategories.map((mc) => mc.category ? { id: mc.category.id, name: mc.category.name } : { id: mc.categoryId, name: '' })
        }
        ));

        const response: filterGeneric<movie[]> = {
            data: moviesWithCategories,
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
type filterHandler = {
    [K in filterMovies]?: (value: filterMovies) => Promise<unknown>
}

const handler: filterHandler = {
    id: async (id: string) => {
        try {
            const movie = await prisma.movie.findMany({
                where: { id },
                include: { movieCategories: { include: { category: true } } }
            })
            const moviesWithCategory = movie.map((movie) => ({
                ...movie,
                categoryIds: movie.movieCategories.map((mc) => mc.categoryId),
                categories: movie.movieCategories.map((mc) => mc.category ? { id: mc.category.id, name: mc.category.name } : { id: mc.categoryId, name: '' })
            }))
            return moviesWithCategory;
        } catch (error: any) {
            console.error(error.message)
            throw new Error(error.message ? `Erro ao listar o filme: ${error.message}` : "Erro ao listar o filme");
        }
    },
    category: async (name: string) => {
        try {
            const category = await prisma.category.findUnique({
                where: { name },
                include: {
                    movieCategorie: {
                        include: {
                            movie: {
                                include: { movieCategories: { include: { category: true } } }
                            }
                        }
                    }
                }
            })
            if (!category) return [];
            const movies = category.movieCategorie.map((mc) => mc.movie).map((movie) => ({
                ...movie,
                categoryIds: movie.movieCategories.map((mc) => mc.categoryId),
                categories: movie.movieCategories.map((mc) => mc.category ? { id: mc.category.id, name: mc.category.name } : { id: mc.categoryId, name: '' })
            }))
            return movies;

        } catch (error: any) {
            console.error(error.message)
            throw new Error(error.message ? `Erro ao listar o filme: ${error.message}` : "Erro ao listar o filme");
        }
    }
}
export const getMoviesByFilter = async (data: Partial<moviesFilter>) => {
    try {
        const key = Object.keys(data)[0] as filterMovies;
        const value = Object.values(data)[0] as filterMovies;
        console.log(key);
        if (handler[key])
            return await handler[key](value);
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao filtrar filmes: ${error.message}` : "Erro ao listar os filmes");
    }
}
export const updateMovie = async (data: movieUpdate, id: string) => {
    try {
        const coverUrl = data.coverImageUrl ? await uploadImage(data.coverImageUrl) : data.coverImageUrl;
        const movieUpdated = await prisma.movie.update({
            where: { id },
            data: {
                ...data,
                coverImageUrl: coverUrl,
                movieCategories: {
                    update: data.categoryIds?.map((categoryId) => ({
                        where: { id },
                        data: {
                            category: {
                                connect: { id: categoryId }
                            }
                        }
                    }))
                },
            },
            include: { movieCategories: true }
        })
        return movieUpdated;
    } catch (error: any) {
        console.error(error.message)
        throw new Error("Erro ao actualizar o filme");
    }
}


export const deleteMovie = async (id: string) => {
    try {
        await prisma.movie.delete({
            where: { id }
        });
    } catch (error: any) {
        console.error(error.message)
        throw new Error("Erro ao eliminar o filme");
    }
}
// export const 
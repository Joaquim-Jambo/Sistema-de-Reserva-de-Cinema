import express from "express"
import authRoutes from './auth';
import adminRoutes from './admin';
import clientRoutes from './client';
import sessionRoutes from "./session";
import categoriesRoutes from "./categories";
import moviesRoutes from "./movies";

const routes = express()

routes.use('/auth', authRoutes);
routes.use('/admin', adminRoutes);
routes.use('/clients', clientRoutes);
routes.use('/sessions', sessionRoutes);
routes.use('/categories', categoriesRoutes)
routes.use('/movies', moviesRoutes);
export default routes;
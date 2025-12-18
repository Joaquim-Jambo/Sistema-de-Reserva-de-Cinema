import express from "express"
import authRoutes from './auth';
import adminRoutes from './admin';
import clientRoutes from './client';

const routes = express()

routes.use('/auth', authRoutes);
routes.use('/admin', adminRoutes);
routes.use('/clients', clientRoutes);

export default routes;
import express from "express"
import authRoutes from './auth';
import adminRoutes from './admin';
import clientRoutes from './client';

const router = express()

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/clients', clientRoutes);

export default router;
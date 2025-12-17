import express from "express"


const authRoutes = express.Router();

authRoutes.post('/register');
authRoutes.post('/login');
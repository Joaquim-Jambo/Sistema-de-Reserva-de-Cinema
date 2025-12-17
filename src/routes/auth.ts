import express from "express"
import { validateBody } from "../middlewares/auth";
import { createUserSchema } from "../schemas/userSchema";
import { registerController } from "../controllers/authController";


const authRoutes = express.Router();

authRoutes.post('/register', validateBody(createUserSchema), registerController);
// authRoutes.post('/login'); // TODO: adicionar loginController

export default authRoutes;
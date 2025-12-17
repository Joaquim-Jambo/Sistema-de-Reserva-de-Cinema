import express from "express"
import { validateBody } from "../middlewares/auth";
import { createUserSchema, loginSchema } from "../schemas/userSchema";
import { loginController, registerController } from "../controllers/authController";


const authRoutes = express.Router();

authRoutes.post('/register', validateBody(createUserSchema), registerController);
authRoutes.post('/login', validateBody(loginSchema), loginController);

export default authRoutes;
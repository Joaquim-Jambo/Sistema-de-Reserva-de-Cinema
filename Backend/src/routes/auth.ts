import express from "express"
import { validateBody } from "../middlewares/index";
import { loginSchema } from "../schemas/userSchema";
import { loginController, } from "../controllers/authController";
import { createClientController } from "../controllers/clientController";
import { createClientSchema } from "../schemas/clientSchema";


const authRoutes = express.Router();

authRoutes.post('/register', validateBody(createClientSchema), createClientController);
authRoutes.post('/login', validateBody(loginSchema), loginController);

export default authRoutes;
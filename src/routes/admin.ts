import express from "express"
import { authenticate, checkRoles, validateBody } from "../middlewares/auth";
import { createAdminController } from "../controllers/adminController";
import { createUserSchema } from "../schemas/userSchema";


const adminRoutes = express.Router();

adminRoutes.post('/users/admin',authenticate(),checkRoles(['Admin']),validateBody(createUserSchema), createAdminController);

export default adminRoutes;
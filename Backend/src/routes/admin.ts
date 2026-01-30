import express from "express"
import { authenticate, checkRoles } from "../middlewares/auth";
import { createAdminController } from "../controllers/adminController";
import { createUserSchema } from "../schemas/userSchema";
import { validateBody } from "../middlewares";


const adminRoutes = express.Router();

adminRoutes.post('/users/admin',authenticate(),checkRoles(['Admin']),validateBody(createUserSchema), createAdminController);

export default adminRoutes;
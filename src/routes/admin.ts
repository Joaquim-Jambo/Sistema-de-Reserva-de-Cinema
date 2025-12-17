import express from "express"
import { checkRoles, validateBody } from "../middlewares/auth";
import { createClientController } from "../controllers/clientController";
import { createClientSchema } from "../schemas/clientSchema";
import { createAdminController } from "../controllers/adminController";
import { createUserSchema } from "../schemas/userSchema";


const adminRoutes = express.Router();

adminRoutes.post('/users/admin',validateBody(createUserSchema), createAdminController);

export default adminRoutes;
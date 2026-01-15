import express from 'express';
import { createSessionController, getAllSessionController, getSessionByFilterController } from '../controllers/sessionController';
import { validateBody, validateParams } from '../middlewares/index';
import { createSessionSchema } from '../schemas/sessionSchema';
import { idSchema } from '../schemas';
import { deleteCategoryController } from '../controllers/categoryController';


const sessionRoutes = express.Router();


sessionRoutes.post("/", validateBody(createSessionSchema), createSessionController);
sessionRoutes.get("/", getAllSessionController);
sessionRoutes.get("/filter", getSessionByFilterController);
sessionRoutes.delete("/:id", validateParams(idSchema), deleteCategoryController);

export default sessionRoutes;

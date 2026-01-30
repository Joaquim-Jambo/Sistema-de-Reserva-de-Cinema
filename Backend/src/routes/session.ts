import express from 'express';
import { createSessionController, getAllSessionController, getSessionByFilterController, updateSessionController } from '../controllers/sessionController';
import { validateBody, validateParams } from '../middlewares/index';
import { createSessionSchema, updateSessionSchema } from '../schemas/sessionSchema';
import { idSchema } from '../schemas';
import { deleteCategoryController } from '../controllers/categoryController';


const sessionRoutes = express.Router();


sessionRoutes.post("/", validateBody(createSessionSchema), createSessionController);
sessionRoutes.get("/", getAllSessionController);
sessionRoutes.get("/filter", getSessionByFilterController);
sessionRoutes.delete("/:id", validateParams(idSchema), deleteCategoryController);
sessionRoutes.put("/:id", validateParams(idSchema), validateBody(updateSessionSchema), updateSessionController);

export default sessionRoutes;

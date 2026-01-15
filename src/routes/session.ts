import express from 'express';
import { createSessionController, getAllSessionController, getSessionByFilterController } from '../controllers/sessionController';
import { validateBody } from '../middlewares/index';
import { createSessionSchema } from '../schemas/sessionSchema';


const sessionRoutes = express.Router();


sessionRoutes.post("/", validateBody(createSessionSchema), createSessionController);
sessionRoutes.get("/", getAllSessionController);
sessionRoutes.get("/filter", getSessionByFilterController);
export default sessionRoutes;

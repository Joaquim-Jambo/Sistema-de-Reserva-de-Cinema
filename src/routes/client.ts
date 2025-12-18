import express from "express"
import { authenticate } from "../middlewares/auth";
import { getAllClientController } from "../controllers/clientController";

const clientRoutes = express.Router();

clientRoutes.get('/', authenticate(), getAllClientController);

export default clientRoutes;
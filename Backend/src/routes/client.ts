import express from "express"
import { authenticate } from "../middlewares/auth";
import { getAllClientController, getOneClientController } from "../controllers/clientController";

const clientRoutes = express.Router();

clientRoutes.get('/', getAllClientController);
clientRoutes.get('/search', getOneClientController);

export default clientRoutes;
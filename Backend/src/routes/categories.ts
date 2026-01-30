import express from "express"
import { validateBody, validateParams, validateQuery } from "../middlewares/index";
import { createCategorySchema } from "../schemas/categorySchema";
import { filterSchema } from "../schemas/index";
import { createCategoryController, deleteCategoryController, getAllCategoryController, getOneCategoryController, updateCategoryController } from "../controllers/categoryController";
import { idSchema } from "../schemas";

const categoriesRoutes = express.Router();

categoriesRoutes.post("/", validateBody(createCategorySchema), createCategoryController)
categoriesRoutes.get("/", validateQuery(filterSchema), getAllCategoryController)
categoriesRoutes.get("/:id", validateParams(idSchema), getOneCategoryController);
categoriesRoutes.put("/:id", validateParams(idSchema), validateBody(createCategorySchema), updateCategoryController);
categoriesRoutes.delete("/:id", validateParams(idSchema), deleteCategoryController)
export default categoriesRoutes
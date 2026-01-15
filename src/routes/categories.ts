import express from "express"
import { validateBody, validateParams, validateQuery } from "../middlewares/index";
import { createCategorySchema, filterCategoriesSchema } from "../schemas/categorySchema";
import { createCategoryController, getAllCategoryController, updateCategoryController } from "../controllers/categoryController";
import { idSchema } from "../schemas";

const categoriesRoutes = express.Router();

categoriesRoutes.post("/", validateBody(createCategorySchema), createCategoryController)
categoriesRoutes.get("/", validateQuery(filterCategoriesSchema), getAllCategoryController)
categoriesRoutes.put("/:id", validateParams(idSchema), validateBody(createCategorySchema), updateCategoryController);
// categoriesRoutes.delete("/:id", validateParams(idSchema), dele)
export default categoriesRoutes
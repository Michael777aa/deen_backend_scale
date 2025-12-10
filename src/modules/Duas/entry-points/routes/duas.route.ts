import express from "express";
import { validateToken } from "../../../../libs/middleware/authMiddleware";
import { authorizeRoles } from "../../../../libs/middleware/role.Middleware";
import duaController from "../api/duas.controller";

const duaRouter = express.Router();

// Public
duaRouter.get("/", duaController.getAllDuas);
duaRouter.get("/:id", duaController.getDuaById);
duaRouter.get("/category/:categoryId", duaController.getDuasByCategory);

// Admin/Moderator
duaRouter.post(
  "/create",
  validateToken,
  authorizeRoles("MODERATOR"),
  duaController.createNewDua
);

duaRouter.post(
  "/:id",
  validateToken,
  authorizeRoles("MODERATOR"),
  duaController.updateDua
);

duaRouter.delete(
  "/:id",
  validateToken,
  authorizeRoles("MODERATOR"),
  duaController.deleteDua
);

export default duaRouter;

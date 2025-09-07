import express from "express";
import inspirationController from "../../../../modules/Inspiration/entry-points/api/inspiration.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";
import { authorizeRoles } from "../../../../libs/middleware/role.Middleware";

const inspirationRouter = express.Router();

inspirationRouter.get("/daily", inspirationController.getDailyInspiration);
inspirationRouter.post(
  "/create",
  validateToken,
  authorizeRoles("MODERATOR"),
  inspirationController.createNewInspiration
);
inspirationRouter.post(
  "/:id",
  validateToken,
  authorizeRoles("MODERATOR"),
  inspirationController.updateChosenInspiration
);

export default inspirationRouter;

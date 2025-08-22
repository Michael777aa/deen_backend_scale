import express from "express";
import inspirationController from "../../../../modules/Inspiration/entry-points/api/inspiration.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";
import { authorizeRoles } from "../../../../libs/middleware/role.Middleware";

const inspirationRouter = express.Router();

inspirationRouter.get("/daily", inspirationController.getDailyInspiration);
inspirationRouter.post(
  "/create",
  authorizeRoles("ADMIN"),
  inspirationController.createNewInspiration
);
inspirationRouter.post(
  "/:id",
  authorizeRoles("ADMIN"),
  inspirationController.updateChosenInspiration
);

export default inspirationRouter;

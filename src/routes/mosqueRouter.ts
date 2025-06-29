import express from "express";

const mosqueRouter = express.Router();

mosqueRouter.get("/mosques");
mosqueRouter.get("/mosques/:id");

export default mosqueRouter;

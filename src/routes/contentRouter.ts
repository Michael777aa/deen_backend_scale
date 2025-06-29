import express from "express";

const contentRouter = express.Router();

contentRouter.get("/content/featured");
contentRouter.get("/content/:id");

export default contentRouter;

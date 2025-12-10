import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import mongoose from "mongoose";
import logger from "./libs/utils/logger";
import server from "./app";

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    logger.info("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3000;
    server.listen(PORT, function () {
      logger.info(`Project running on http://localhost:${PORT} `);
    });
  })
  .catch((err: any) => {
    logger.error("ERROR on connection MongoDB", err);
  });

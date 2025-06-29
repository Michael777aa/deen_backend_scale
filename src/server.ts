import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import mongoose from "mongoose";
import app from "./app";

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, function () {
      console.info(`Project running on http://localhost:${PORT} \n`);
    });
  })
  .catch((err) => {
    console.log("ERROR on connection MongoDB", err);
  });

import cors from "cors";
import express, { NextFunction, Response, Request } from "express";
import path from "path";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./libs/utils/errors";
import http from "http";
import userRouter from "./router";
import courseRouter from "./course.router";
import orderRouter from "./order.router";
import notificationRouter from "./notification.router";
import analyticsRouter from "./analytics.router";
import layoutRouter from "./layout.router";
import { initSocketServer } from "./socketServer";

//1-ENTRANCE
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(
  cors({
    origin: process.env.ORIGIN, // Adjust this to your frontend's URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(ErrorMiddleware);
app.use(morgan(MORGAN_FORMAT));

app.set("views", path.join(__dirname, "mails"));
app.set("view engine", "ejs");

// 4-ROUTERS

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/order", orderRouter);
app.use("/notification", notificationRouter);
app.use("/analyze", analyticsRouter);
app.use("/layout", layoutRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Route ${req.originalUrl} not found`);

  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);

const server = http.createServer(app);
initSocketServer(server);
export default server;

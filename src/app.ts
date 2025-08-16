import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { limiter, MORGAN_FORMAT } from "./libs/config";
import authRouter from "./routes/authRouter";
import layoutRouter from "./routes/layoutRouter";
import helmet from "helmet";
import prayerRouter from "./routes/prayerRouter";
import qiblaRouter from "./routes/qiblaRouter";
import calendarRouter from "./routes/calendarRouter";
import contentRouter from "./routes/contentRouter";
import mosqueRouter from "./routes/mosqueRouter";
import inspirationRouter from "./routes/inspiration.router";
import streamRouter from "./routes/streamRouter";
import chatgptRouter from "./routes/chatgptRouter";
import quranRouter from "./routes/settingsRouter";
import audioRouter from "./routes/audioRouter";

//1-ENTRANCE MIDDLEWARES
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(morgan(MORGAN_FORMAT));
app.use(helmet());
app.use(limiter);

// 4-ROUTERS
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/layout", layoutRouter);
app.use("/api/v1/prayer", prayerRouter);
app.use("/api/v1/qibla", qiblaRouter);
app.use("/api/v1/inspiration", inspirationRouter);
app.use("/api/v1/chatgpt", chatgptRouter);
app.use("/api/v1/str", streamRouter);
app.use("/api/v1/calendar", calendarRouter);
app.use("/api/v1/quran", quranRouter);
app.use("/api/v1/audio", audioRouter);
app.use("/api/v1", contentRouter);
app.use("/api/v1", mosqueRouter);

export default app;

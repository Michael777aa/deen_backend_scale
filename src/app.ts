import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimiter } from "./libs/utils/rateLimiting";
import { MORGAN_FORMAT } from "./libs/utils/config";
import layoutRouter from "./modules/Layout/entry-points/routes/layout.route";
import prayerRouter from "./modules/Prayer/entry-points/routes/prayer.route";
import inspirationRouter from "./modules/Inspiration/entry-points/routes/inspiration.route";
import chatgptRouter from "./modules/Chatgpt/entry-points/routes/chatgpt.route";
import streamRouter from "./modules/Stream/entry-points/routes/stream.route";
import quranRouter from "./modules/Quran/entry-points/routes/quran.route";

// ENTRANCE
const app = express();
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan(MORGAN_FORMAT));
app.use(rateLimiter);

// ROUTERS
app.use("/api/v1/layout", layoutRouter);
app.use("/api/v1/prayer", prayerRouter);
app.use("/api/v1/inspiration", inspirationRouter);
app.use("/api/v1/chatgpt", chatgptRouter);
app.use("/api/v1/str", streamRouter);
app.use("/api/v1/quran", quranRouter);
// app.use("/api/v1/calendar", calendarRouter);
// app.use("/api/v1/audio", audioRouter);
// app.use("/api/v1", contentRouter);
// app.use("/api/v1", mosqueRouter);

import "./modules/Inspiration/domain/inspirationScheduler";

export default app;

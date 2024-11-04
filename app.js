import express from "express";
import "express-async-errors";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import videoRouter from "./router/video.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://mp4tojpg.vercel.app",
    credentials: true,
  })
);

app.use(morgan("tiny"));
app.use(helmet());

app.use("/video", videoRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});

app.listen(8080);

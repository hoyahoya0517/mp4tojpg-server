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
    origin: "http://localhost:3000",
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
// const ffmpegPath = ffmpegInstaller.path;
// ffmpeg.setFfmpegPath(ffmpegPath);

// let duration;
// ffmpeg.ffprobe(
//   "https://res.cloudinary.com/hoyahoya/video/upload/v1703048422/letter/videoplayback.CUT.05_16-05_30_oexws3.mp4",
//   (err, metadata) => {
//     duration = metadata.format.duration;
//   }
// );

// ffmpeg(
//   "https://res.cloudinary.com/hoyahoya/video/upload/v1703048422/letter/videoplayback.CUT.05_16-05_30_oexws3.mp4"
// )
//   .on("filenames", function (filenames) {
//     console.log("Will generate " + filenames.join(", "));
//   })
//   .on("end", function () {
//     console.log("Screenshots taken");
//   })
//   .screenshots({
//     // Will take screens at 20%, 40%, 60% and 80% of the video
//     count: 140,
//     folder: "public/test",
//     size: "320x320",
//     filename: "test.jpg",
//   });

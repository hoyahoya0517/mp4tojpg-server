import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import "express-async-errors";

const ffmpegPath = ffmpegInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);

export async function getVideo(req, res, next) {
  console.log("1.24");
  let duration = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(
      "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1727679157145_video22_vhm7v7.mp4",
      (err, metadata) => {
        console.log(metadata);
        resolve(metadata.format.duration);
      }
    );
  });
  duration = Math.floor(duration);

  ffmpeg(req.file.location)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
    })
    .on("end", function () {
      console.log("Screenshots taken");
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: duration,
      folder: "public",
      size: "320x320",
      filename: "test.jpg",
    });
  res.json({ hi: "hi2" });
}

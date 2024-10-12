import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpegInstallerffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "express-async-errors";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffmpegInstallerffprobe.path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  },
});

export async function getVideo(req, res, next) {
  let jpgs = [];
  let uploadUrl = [];
  let date = "";
  let width = "";
  let height = "";
  let duration = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(req.file.location, (err, metadata) => {
      date = Date.now().toString();
      width = metadata.streams[0].width;
      height = metadata.streams[0].height;
      resolve(metadata.format.duration);
    });
  });
  duration = Math.floor(duration);

  const ffmpegResult = await new Promise((resolve, reject) => {
    ffmpeg(req.file.location)
      .on("filenames", function (filenames) {
        jpgs = filenames.map((filename) => {
          return `public/${date}/${filename}`;
        });
      })
      .on("end", function () {
        console.log("ffmpeg success");
        resolve(true);
      })
      .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: duration * 7,
        folder: `public/${date}`,
        size: `${width}x${height}`,
        filename: `${date}.jpg`,
      });
  });
  if (!ffmpegResult) return res.sendStatus(400);

  await Promise.all(
    jpgs.map(async (jpg) => {
      const buffer = fs.readFileSync(jpg);
      const jpgName = jpg.split("/")[2];
      const command = new PutObjectCommand({
        Bucket: "sakaomp4tojpg",
        Key: jpgName,
        Body: buffer,
      });
      const response = await s3.send(command);
      const imgUrl = `https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/${jpgName}`;
      uploadUrl.push(imgUrl);
    })
  );
  console.log("upload success");

  uploadUrl.sort((a, b) => {
    const splitA = a.split("/");
    const lengthA = splitA.length;
    const numberA = Number(splitA[lengthA - 1].split("_")[1].split(".")[0]);
    const splitB = b.split("/");
    const lengthB = splitB.length;
    const numberB = Number(splitB[lengthB - 1].split("_")[1].split(".")[0]);
    return numberA - numberB;
  });
  console.log("sort success");

  fs.rm(`public/${date}`, { recursive: true }, () => {
    console.log("dir delete success");
  });

  return res.status(200).json(uploadUrl);
}

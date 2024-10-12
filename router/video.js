import express from "express";
import * as videoController from "../controller/video.js";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sakaomp4tojpg",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// router.post("/", (req, res, next) => {
//   res.json([
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_1.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_2.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_3.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_4.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_5.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_6.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_7.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_8.jpg",
//     "https://sakaomp4tojpg.s3.ap-northeast-2.amazonaws.com/1728139527404_9.jpg",
//   ]);
// });
router.post("/", upload.single("video"), videoController.getVideo);

export default router;

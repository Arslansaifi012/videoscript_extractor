import express from "express";
import fs from "fs";
import sharp from "sharp";


const app = express();

import ffmpegPath from "ffmpeg-static";
import Ffmpeg from "fluent-ffmpeg";
Ffmpeg.setFfmpegPath(ffmpegPath);

Ffmpeg("./video/video.mp4")
  .outputOptions("-vf", "fps=2")
  .output("./frames/image-%04d.jpg")
  .on("error", function (error) {
    console.log("An error occured", error.message);
  })
  .on("end", function () {
    console.log("frame extracted complete");
  })
    .run();



    const frames = fs
      .readdirSync("./frames")
      .filter((file) => file.endsWith(".jpg"))
      .sort();

    let previousHash = null;

    for (const frame of frames) {
      const image = await sharp(`./frames/${frame}`)
        .resize(64, 64)
        .grayscale()
        .raw()
        .toBuffer();

      const currentHash = image.toString("hex");

      if (!previousHash) {
        console.log("First frame:", frame);
        previousHash = currentHash;
        continue;
      }

      if (currentHash !== previousHash) {
        console.log("CHANGE:", frame);
        previousHash = currentHash;
      }
    }
  



export default app;

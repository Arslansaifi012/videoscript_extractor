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


  


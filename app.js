import express from "express";
import { createWorker } from "tesseract.js";
import fs from "fs";

const VIDEO_PATH = "./video/video.mp4";
const TEMP_DIR = path.resolve("frames");
import ffmpegPath from "ffmpeg-static";
import Ffmpeg from "fluent-ffmpeg";
import path from "path";

Ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();


if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function extractSceneFrames(videoPath) {
  return new Promise((resolve, reject) => {
    const outputPattern = path.join(TEMP_DIR, "image-%04d.jpg");

    Ffmpeg(videoPath)
      .outputOptions([
        // Single quotes hataye aur comma escape (\,) kiya
        "-vf",
        "select=gt(scene\\,0.35)",
        "-vsync",
        "vfr",
      ])
      .output(outputPattern)
      .on("start", (cmd) => {
        console.log("Processing started...");
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        reject(err);
      })
      .on("end", () => {
        // readdirSync use kiya aur extension .jpg match kiya
        const files = fs
          .readdirSync(TEMP_DIR)
          .filter((file) => file.endsWith(".jpg"))
          .sort();

        console.log(`Extracted ${files.length} frames.`);
        resolve(files);
      })
      .run();
  });
}

//////////////////////////////////////////////////  OCR  ///////////////////////////////

async function extractTranscript() {
  const frames = await extractSceneFrames(VIDEO_PATH);
  console.log(`Extracted ${frames.length} scene-change frames.`);

  const worker = await createWorker(["eng", "hin"]);

  const transcript = [];
  let lastText = "";

  for (const file of frames) {
    const filePath = path.join(TEMP_DIR, file);

    const {
      data: { text },
    } = await worker.recognize(filePath);
    console.log(text, "i am checking text of image");
  }
}

extractSceneFrames();

export default app;

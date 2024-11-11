import { Request, Response } from "express";
import multer from "multer";
import { IUser } from "../models/user.model";
import redis from "../config/redis";
import { detectContractType, extractTextFromPDF } from "../services/ai.services";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only PDF files are allowed"));
    }
  },
}).single("contract");

export const uploadMiddleware = upload;

export const detectAndConfirmContract = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const fileKey = `${user._id}:${Date.now()}`;
    await redis.set(fileKey, req.file.buffer);
    await redis.expire(fileKey, 3600); // 1 hour

    const textPDF = await extractTextFromPDF(fileKey);
    const contractType = await detectContractType(textPDF);

    await redis.del(fileKey);
    res.json({ contractType });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

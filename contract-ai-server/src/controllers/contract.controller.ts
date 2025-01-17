import { Request, Response } from "express";
import multer from "multer";
import { IUser } from "../models/user.model";
import redis from "../config/redis";
import { analyzeContractWithAI, detectContractType, extractTextFromPDF } from "../services/ai.services";
import ContractAnalysisSchema, {
  IContractAnalysis,
} from "../models/contract.model";
import { isValidMongoId } from "../utils";

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

export const detectAndConfirmContractType = async (req: Request, res: Response) => {
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
    res.json({ detectedType: contractType });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const analyzeContract = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { contractType } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (!contractType) {
    return res.status(400).json({ message: "Contract type is required" });
  }
  try {
    const fileKey = `${user._id}:${Date.now()}`;
    await redis.set(fileKey, req.file.buffer);
    await redis.expire(fileKey, 3600); // 1 hour
    const textPDF = await extractTextFromPDF(fileKey);
    let analysis = await analyzeContractWithAI(textPDF, contractType, user.isPremium ? "premium" : "free")
    if (!analysis.summary || !analysis.risks || !analysis.opportunities) {
      throw new Error("Failed to analyze contract");
    }
    const savedAnalysis = await ContractAnalysisSchema.create({
      userId: user._id,
      contractText: textPDF,
      contractType,
      ...(analysis as Partial<IContractAnalysis>),
      language: "en",
      aiModel: "gemini-pro",
    });

    res.json(savedAnalysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as IUser;

  if (!isValidMongoId(id)) {
    return res.status(400).json({ message: "Invalid contract ID" });
  }

  try {
    const cachedContract = await redis.get(`${user._id}:${id}`);
    if (cachedContract) {
      return res.json(cachedContract);
    }
    const contract = await ContractAnalysisSchema.findOne({ _id: id, userId: user._id });
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    await redis.set(`${user._id}:${id}`, JSON.stringify(contract));
    res.json(contract);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserContracts = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    interface QueryType {
      userId: string;
    }
    console.log('user', user)
    const query: QueryType = { userId: user._id as string };
    const contracts = await ContractAnalysisSchema.find(query).sort({ createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

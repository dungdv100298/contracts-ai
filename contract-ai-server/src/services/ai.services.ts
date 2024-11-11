import redis from "../config/redis";
import { getDocument } from "pdfjs-dist";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const AI_MODEL = "gemini-pro";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const extractTextFromPDF = async (fileKey: string) => {
  try {
    const fileData = await redis.get(fileKey);
    if (!fileData) {
      throw new Error("File not found");
    }
    let fileBuffer: Uint8Array;
    if (Buffer.isBuffer(fileData)) {
      fileBuffer = new Uint8Array(fileData);
    } else if (typeof fileData === "object" && fileData !== null) {
      const bufferData = fileData as { type?: string; data?: number[] };
      if (bufferData.type === "Buffer") {
        fileBuffer = new Uint8Array(bufferData.data as number[]);
      } else {
        throw new Error("Invalid file data");
      }
    } else {
      throw new Error("Invalid file data");
    }
    const pdfDoc = await getDocument({ data: fileBuffer }).promise;
    let text = "";
    for (let i = 0; i < pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to extract text from PDF: ${JSON.stringify(error)}`);
  }
};

export const detectContractType = async (contractText: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: AI_MODEL });
  const prompt = `
    Analyze the following text and determine the type of contract it is.
    Provide only the contract type as a single string(e.g. "Employment", "Non-Disclosure Agreement", "Sales", "Lease" etc.).
    Do not include any additional explanation or context.
    Contract text:
    ${contractText.substring(0, 2000)}
  `;
  const results = await model.generateContent(prompt);
  const response = await results.response;
  return response.text().trim();
};

export const analyzeContract = async (contractText: string, contractType: string) => {

}

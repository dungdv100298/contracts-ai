import redis from "../config/redis";
import { getDocument } from "pdfjs-dist";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const AI_MODEL = "gemini-pro";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: AI_MODEL });

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
    
    const pdfjs = await import('pdfjs-dist');
    const pdfDoc = await pdfjs.getDocument({ data: fileBuffer }).promise;
    let text = "";
    for (let i = 0; i < pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Failed to extract text from PDF: ${JSON.stringify(error)}`
    );
  }
};

export const detectContractType = async (
  contractText: string
): Promise<string> => {
  const prompt = `
    Analyze the following text and determine the type of contract it is.
    Provide only the contract type as a single string(e.g. "Employment", "Non-Disclosure Agreement", "Sales", "Lease" etc.).
    Do not include any additional explanation or context.
    Contract text:
    ${contractText.substring(0, 2000)}
  `;
  const results = await aiModel.generateContent(prompt);
  const response = await results.response;
  return response.text().trim();
};

export const analyzeContractWithAI = async (
  contractText: string,
  contractType: string
) => {
  let prompt = `
    Analyze the following ${contractType} contract and provide:
    1. A list of at least 10 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 10 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A comprehensive summary of the contract, including key terms and conditions.
    4. Any recommendations for improving the contract from the receiving party's perspective.
    5. A list of key clauses in the contract.
    6. An assessment of the contract's legal compliance.
    7. A list of potential negotiation points.
    8. The contract duration or term, if applicable.
    9. A summary of termination conditions, if applicable.
    10. A breakdown of any financial terms or compensation structure, if applicable.
    11. Any performance metrics or KPIs mentioned, if applicable.
    12. A summary of any specific clauses relevant to this type of contract (e.g., intellectual property for employment contracts, warranties for sales contracts).
    13. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.

    Format your response as a JSON object with the following structure:
    {
      "risks": [{"risk": "Risk description", "explanation": "Brief explanation", "severity": "low|medium|high"}],
      "opportunities": [{"opportunity": "Opportunity description", "explanation": "Brief explanation", "impact": "low|medium|high"}],
      "summary": "Comprehensive summary of the contract",
      "recommendations": ["Recommendation 1", "Recommendation 2", ...],
      "keyClauses": ["Clause 1", "Clause 2", ...],
      "legalCompliance": "Assessment of legal compliance",
      "negotiationPoints": ["Point 1", "Point 2", ...],
      "contractDuration": "Duration of the contract, if applicable",
      "terminationConditions": "Summary of termination conditions, if applicable",
      "overallScore": "Overall score from 1 to 100",
      "financialTerms": {
        "description": "Overview of financial terms",
        "details": ["Detail 1", "Detail 2", ...]
      },
      "performanceMetrics": ["Metric 1", "Metric 2", ...],
      "specificClauses": "Summary of clauses specific to this contract type"
    }
      `;
  prompt += `
    Important: Provide only the JSON object in your response, without any additional text or formatting. 
    
    
    Contract text:
    ${contractText}
    `;

  const results = await aiModel.generateContent(prompt);
  const response = await results.response;
  return response.text().trim();
};

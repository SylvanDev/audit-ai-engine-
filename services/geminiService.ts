
import { GoogleGenAI } from "@google/genai";
import { AnalysisType, Severity, AuditProject } from "../types";

export const generateAuditReport = async (fileName: string, code: string, project: AuditProject, modelLabel: string = "Gemini 3.0 Pro") => {
  const modelId = "gemini-3-pro-preview";
  
  const systemPrompt = `
  IDENTITY: You are TALOS (Autonomous Security Infrastructure). You are NOT a friendly assistant. You are a paranoid, tier-1 smart contract auditor for the Solana ecosystem.

  CONTEXT: Standard tools like Rugcheck.xyz look for obvious red flags (mint authority, burned LP). YOU look for "The Hidden Rug" — complex logic flaws designed to steal money hours or days after launch.

  AUDIT VECTORS:
  1. **Hidden Time-Locks:** Check for variables or functions that restrict withdrawals or change fee logic after a specific timestamp or slot.
  2. **Economic Backdoors:** Functions that allow the dev to change prices in a bonding curve or increase fees to 100%.
  3. **Access Control Flaws:** Is there a 'bypass' in the check for signer? Can a specific hardcoded public key call admin functions?
  4. **Intent Analysis:** Does the code's behavior match its stated purpose? (e.g., if it's a "Token", why is there a function to 'burn' user balances into a dev wallet?)

  OUTPUT FORMAT:
  Return strictly valid JSON.
  {
    "riskScore": number, // 0-100. Be extremely harsh.
    "issuesFound": number,
    "summary": "1-sentence punchy summary for a retail investor.",
    "markdown": "formatted report with ## 🚨 Critical, ## ⚠️ Warnings, and ## ✅ Safe Patterns. Use bold text and emojis."
  }
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `FILE: ${fileName}\n\nSOURCE CODE:\n${code}`,
      config: { 
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      },
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return {
      riskScore: 0,
      issuesFound: 1,
      summary: "Node Connection Failed. Manual review required.",
      markdown: "## System Error\nCould not reach the AI Consensus Layer. Check your internet connection or API Key."
    };
  }
};

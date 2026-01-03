import { GoogleGenAI } from "@google/genai";
import { AnalysisType, Severity, AuditProject } from "../types";

export const analyzeCode = async (code: string, type: AnalysisType, context: string, fileName: string, project: AuditProject) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-pro-preview";

  let systemPrompt = `You are AuditAI, a Senior Smart Contract Auditor.`;
  // ... (Keeping original logic for simple analysis if needed, but main focus is on generateAuditReport)

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `File Name: ${fileName}\nAnalysis Type: ${type}\nAdditional Context: ${context}\n\nCODE TO AUDIT:\n\`\`\`\n${code}\n\`\`\``,
      config: { systemInstruction: systemPrompt },
    });
    return response.text;
  } catch (error) {
    return "Audit service unavailable. Please check API connection.";
  }
};

export const generateAuditReport = async (fileName: string, code: string, project: AuditProject, modelLabel: string = "Gemini 1.5 Pro") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-pro-preview";
  
  // We inject the "persona" of the selected model into the system prompt.
  // This makes Gemini 'act' like the selected engine or the ensemble.
  const systemPrompt = `You are AuditAI, an advanced automated security auditor.
  
  **OPERATIONAL MODE:** ${modelLabel}
  ${modelLabel.includes('Unified') ? 
    "You are acting as a Consensus Engine, synthesizing findings from multiple LLM perspectives (GPT-4o, Claude 3.5, Gemini). Be extremely critical, precise, and authoritative. Cross-reference findings to eliminate false positives." : 
    `You are simulating the analytical style of ${modelLabel}. Focus on the specific strengths of this model (e.g., if Claude - focus on safety/nuance; if GPT-4 - focus on broad reasoning).`}

  **PROJECT:** ${project.name}
  **FILE:** ${fileName}
  
  **TASK:**
  Analyze the code and determine a "Risk Score" (0-100, where 100 is Safe, 0 is Dangerous).
  Identify the number of issues.
  Write a summary suitable for an Investor Due Diligence report.
  
  **OUTPUT JSON:**
  {
    "riskScore": number, // 0 to 100
    "issuesFound": number,
    "summary": "string (Short professional summary, mentioning the analysis engine used)",
    "markdown": "string (Full detailed report with fixes, strictly formatted in Markdown)"
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `File: ${fileName}\nCode:\n${code}`,
      config: { 
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      },
    });
    
    // Ensure response.text is not undefined
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return {
      riskScore: 50,
      issuesFound: 0,
      summary: "Automated audit failed to generate.",
      markdown: "Service error. Please try again."
    };
  }
};
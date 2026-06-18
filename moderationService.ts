import { GoogleGenAI, Type } from "@google/genai";

export interface ModerationResult {
  is_fit_related: boolean;
  is_worn_or_styled_on_person: boolean;
  category: string;
  confidence: number;
  decision: 'accept' | 'maybe' | 'reject';
  reason: string;
}

export async function moderateImage(base64Image: string): Promise<ModerationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  
  const prompt = `You are an image moderation system for a college outfit-sharing app.

Your job is to decide whether the uploaded image is valid for a daily fit check.

Accept the image if it shows clothing, shoes, jewelry, bags, accessories, nails, makeup, or an outfit being worn or clearly styled on a person.

Reject the image if it shows random objects, food, rooms, screenshots, memes, product photos, or fashion items lying alone on a table, bed, or floor.

If the image is fashion-related but not clearly worn or styled on a person, mark it as "maybe".

Return ONLY this JSON format:
{
  "is_fit_related": true,
  "is_worn_or_styled_on_person": true,
  "category": "outfit",
  "confidence": 0.95,
  "decision": "accept",
  "reason": "The image shows a person wearing a full outfit."
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_fit_related: { type: Type.BOOLEAN },
            is_worn_or_styled_on_person: { type: Type.BOOLEAN },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            decision: { 
              type: Type.STRING,
              enum: ["accept", "maybe", "reject"]
            },
            reason: { type: Type.STRING },
          },
          required: ["is_fit_related", "is_worn_or_styled_on_person", "category", "confidence", "decision", "reason"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Moderation error:", error);
    // Fallback if AI fails or returns invalid JSON
    return {
      is_fit_related: true,
      is_worn_or_styled_on_person: true,
      category: "unknown",
      confidence: 0.5,
      decision: "accept", // Default to accept in case of technical failure to not block user, or should we?
      reason: "Auto-accepted due to technical processing error."
    };
  }
}

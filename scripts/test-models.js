const { GoogleGenerativeAI } = require("@google/generative-ai");
// require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    // We can't list models directly with the helper in a simple way without looking up the docs for exact method on genAI, 
    // actually it's not on genAI instance directly usually. 
    // Looking at docs, typically there isn't a simple listModels on the client instance in some versions?
    // Wait, the error message literally says "Call ListModels".
    
    // Let's try to just hit the REST API to list models if I can't find the SDK method quickly, 
    // but SDK is better.
    // Actually, checking standard usage:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    // ... unfortunately listModels isn't always exposed on the high level class.
    
    // Let's rely on a common one: 'gemini-1.5-flash-latest' or 'gemini-pro' (which failed).
    
    // Let's try 'gemini-1.0-pro'.
    
    // Changing strategy: I will create a script that tries multiple model names and prints which one works.
    
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-latest",
        "gemini-1.0-pro",
        "gemini-pro",
        "gemini-1.5-pro"
    ];

    console.log("Testing models...");
    
    for (const modelName of candidates) {
        try {
            const m = genAI.getGenerativeModel({ model: modelName });
             // Just generate something simple
            const result = await m.generateContent("Hi");
            console.log(`✅ Model '${modelName}' works!`);
            // If one works, we are good.
        } catch (e) {
            console.log(`❌ Model '${modelName}' failed: ${e.message.split('\n')[0]}`);
        }
    }

  } catch (error) {
    console.error("Script error:", error);
  }
}

listModels();

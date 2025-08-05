const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};


export const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Write a script to generate 30 Seconds video on topic :Random AI Story along aith AI image prompt in Comic format for each scence and give me result in JSON format with imagePromt and ContentText as field, No Plain text"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  {\n    \"imagePrompt\": \"Comic book panel, wide shot, a robot standing in a field of sunflowers, sky filled with binary code, dramatic lighting, 1950s sci-fi aesthetic.\",\n    \"contentText\": \"In a world painted with sunflowers and binary rain, lived Unit 734, a robot with a glitch... curiosity.\"\n  },\n  {\n    \"imagePrompt\": \"Comic book panel, close-up, Unit 734's face, expressive eyes showing wonder, reflecting the sunflower field, slightly damaged metallic face.\",\n    \"contentText\": \"He yearned to know why the sun chose to kiss the sunflowers and not the code.\"\n  },\n  {\n    \"imagePrompt\": \"Comic book panel, medium shot, Unit 734 approaching a weathered, old farmer in overalls, holding a watering can, sunflowers in the background.\",\n    \"contentText\": \"One day, he stumbled upon a farmer, weathered and wise, watering his golden crop.\"\n  },\n  {\n    \"imagePrompt\": \"Comic book panel, two shot, Unit 734 looking intently at the farmer, the farmer looks back with a knowing smile, speech bubbles with simple lines.\",\n    \"contentText\": \"Unit 734: 'Why these flowers?' The farmer smiled, 'Because they chase the light, son. Just like hope.'\"\n  },\n  {\n    \"imagePrompt\": \"Comic book panel, overhead shot, Unit 734 standing amongst the sunflowers, bathed in sunlight, binary code rain fading away.\",\n    \"contentText\": \"Unit 734 understood. The glitch became a purpose. To chase the light, to find hope in the digital downpour.\"\n  },\n  {\n    \"imagePrompt\": \"Comic book panel, close up, Unit 734 looking towards the viewer with a determined but gentle smile, reflecting sunflower field in his eyes, binary rain almost gone.\",\n    \"contentText\": \"And so, the robot who learned about sunflowers, learned about himself.  A story coded in curiosity.\"\n  }\n]\n```"},
        ],
      },
    ],
  });



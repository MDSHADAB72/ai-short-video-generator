// // File: /app/api/generate-audio/route.js
// import { NextResponse } from 'next/server';
// import path from 'path';
// import fs from 'fs';
// import { execSync } from 'child_process';
// import os from 'os';
// import { db } from "@/configs/db";
// import { Scripts } from "@/configs/schema";

// // Ensure directory exists for storing audio files
// const AUDIO_DIR = process.env.AUDIO_DIR || path.join(process.cwd(), 'public', 'audio');

// if (!fs.existsSync(AUDIO_DIR)) {
//   fs.mkdirSync(AUDIO_DIR, { recursive: true });
// }

// export async function POST(request) {
//   try {
//     const { text, id, userId } = await request.json();

//     if (!text) {
//       return NextResponse.json(
//         { error: "Text content is required" },
//         { status: 400 }
//       );
//     }

//     // Generate a unique filename
//     const filename = `speech_${id || Date.now()}.mp3`;
//     const outputPath = path.join(AUDIO_DIR, filename);

//     // Create download URL
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//     const downloadUrl = `${baseUrl}/audio/${filename}`;

//     // Save text to a temporary file (for long texts)
//     const tempFile = path.join(os.tmpdir(), `text_${Date.now()}.txt`);
//     fs.writeFileSync(tempFile, text);

//     try {
//       // Use gTTS (Google Text-to-Speech) via command line
//       execSync(`gtts-cli --file ${tempFile} --output ${outputPath}`, { stdio: 'inherit' });

//       // Clean up temp file
//       fs.unlinkSync(tempFile);

//       // Save to database
//       await db.insert(Scripts).values({
//         id: id || crypto.randomUUID(),
//         userId,
//         content: text,
//         audioUrl: downloadUrl,
//         localPath: outputPath,
//         audioGenerated: true
//       });

//       return NextResponse.json({
//         success: true,
//         message: "Audio file generated successfully",
//         downloadUrl,
//         audioUrl: downloadUrl,
//         localPath: outputPath
//       });
//     } catch (error) {
//       console.error("TTS conversion error:", error);
//       return NextResponse.json(
//         { error: "Failed to convert text to speech" },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("API route error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to process request" },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from 'next/server';
// import { db } from "@/configs/db";
// import { Scripts } from "@/configs/schema";
// import crypto from 'crypto';

// export async function POST(request) {
//   try {
//     const { text, id, userId } = await request.json();

//     if (!text) {
//       return NextResponse.json(
//         { error: "Text content is required" },
//         { status: 400 }
//       );
//     }

//     // Generate unique identifiers
//     const audioId = id || crypto.randomUUID();
//     const filename = `speech_${audioId}.mp3`;

//     // Create download URL without actually creating the file
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//     const downloadUrl = `${baseUrl}/api/audio/stream/${filename}`;

//     try {
//       // Save to database without local file storage
//       await db.insert(Scripts).values({
//         id: audioId,
//         userId,
//         content: text,
//         audioUrl: downloadUrl,
//         localPath: null, // No local path needed
//         audioGenerated: true
//       });

//       return NextResponse.json({
//         success: true,
//         message: "Audio URL generated successfully",
//         downloadUrl,
//         audioUrl: downloadUrl
//       });

//     } catch (error) {
//       console.error("Database error:", error);
//       return NextResponse.json(
//         { error: "Failed to save audio information" },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("API route error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to process request" },
//       { status: 500 }
//     );
//   }
// }
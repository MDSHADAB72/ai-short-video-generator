// import { NextResponse } from 'next/server';
// import path from 'path';
// import fs from 'fs';
// import axios from 'axios';

// // Ensure directory exists for storing audio files
// const AUDIO_DIR = process.env.AUDIO_DIR || path.join(process.cwd(), 'public', 'audio');

// if (!fs.existsSync(AUDIO_DIR)) {
//   try {
//     fs.mkdirSync(AUDIO_DIR, { recursive: true });
//     console.log(`Created directory: ${AUDIO_DIR}`);
//   } catch (err) {
//     console.error(`Failed to create directory ${AUDIO_DIR}:`, err);
//   }
// }

// export async function POST(request) {
//   try {
//     // Log the beginning of the request for debugging
//     console.log("Starting ElevenLabs API request");

//     const { text, id, voiceId, modelId, stability, clarity, style } = await request.json();

//     // Check API key
//     const apiKey = process.env.ELEVENLABS_API_KEY;
//     if (!apiKey) {
//       console.error("Missing ElevenLabs API key");
//       return NextResponse.json(
//         { error: "Missing API key. Please set the ELEVENLABS_API_KEY environment variable." },
//         { status: 500 }
//       );
//     }


//     // Log API key format (don't log the actual key)
//     console.log(`API key format check: ${apiKey.length} characters, starts with ${apiKey.substring(0, 3)}...`);

//     if (!text) {
//       return NextResponse.json(
//         { error: "Text content is required" },
//         { status: 400 }
//       );
//     }

//     // Generate a unique filename
//     const filename = `speech_${id || Date.now()}.mp3`;
//     const outputPath = path.join(AUDIO_DIR, filename);
//     console.log(`Output path: ${outputPath}`);

//     // Default voice IDs
//     const VOICE_OPTIONS = {
//       "rachel": "21m00Tcm4TlvDq8ikWAM",
//       "domi": "AZnzlk1XvdvUeBnXmlld",
//       "bella": "EXAVITQu4vr4xnSDxMaL",
//       "antoni": "ErXwobaYiN019PkySvjV",
//       "elli": "MF3mGyEYCl7XYWbV9V6O",
//       "josh": "TxGEqnHWrfWFTfGW9XjX",
//       "arnold": "VR6AewLTigWG4xSOukaG",
//       "adam": "pNInz6obpgDQGcFmaJgB",
//       "sam": "yoZ06aMxZJJ28mfd3POQ"
//     };

//     // Use the selected voice or default to "josh"
//     const selectedVoiceId = VOICE_OPTIONS[voiceId] || voiceId || VOICE_OPTIONS.josh;
//     console.log(`Selected voice ID: ${selectedVoiceId}`);

//     // Set model and voice parameters
//     const selectedModelId = modelId || "eleven_multilingual_v2";
//     const voiceSettings = {
//       stability: stability !== undefined ? stability : 0.5,
//       similarity_boost: clarity !== undefined ? clarity : 0.75,
//       style: style !== undefined ? style : 0,
//       use_speaker_boost: true
//     };

//     console.log("Voice settings:", voiceSettings);

//     try {
//       console.log("Sending request to ElevenLabs API...");

//       // Make API request to ElevenLabs
//       const response = await axios({
//         method: 'POST',
//         url: `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
//         headers: {
//           'xi-api-key': apiKey,
//           'Content-Type': 'application/json',
//           'Accept': 'audio/mpeg'
//         },
//         data: {
//           text,
//           model_id: selectedModelId,
//           voice_settings: voiceSettings
//         },
//         responseType: 'arraybuffer'
//       });

//       console.log("Received response from ElevenLabs API");

//       // Verify we got audio data
//       if (!response.data || response.data.length === 0) {
//         console.error("No audio data received");
//         return NextResponse.json(
//           { error: "No audio data received from ElevenLabs" },
//           { status: 500 }
//         );
//       }

//       // Save the audio file
//       try {
//         fs.writeFileSync(outputPath, Buffer.from(response.data));
//         console.log(`Successfully saved audio file to ${outputPath}`);
//       } catch (fileError) {
//         console.error("Failed to write audio file:", fileError);
//         return NextResponse.json(
//           { error: `Failed to save audio file: ${fileError.message}` },
//           { status: 500 }
//         );
//       }

//       // Return the URL path to access the audio file
//       const audioUrl = `/audio/${filename}`;

//       return NextResponse.json({
//         success: true,
//         message: "Audio file generated successfully",
//         audioUrl,
//         localPath: outputPath,
//         voiceId: selectedVoiceId,
//         voiceName: Object.keys(VOICE_OPTIONS).find(key => VOICE_OPTIONS[key] === selectedVoiceId) || voiceId
//       });
//     } catch (error) {
//       console.error("TTS conversion error:", error);
//       // Log more details about the error
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response headers:", error.response.headers);

//         // Try to parse the error body if it's not binary
//         if (error.response.data && !Buffer.isBuffer(error.response.data)) {
//           console.error("Error response data:", error.response.data);
//         } else if (Buffer.isBuffer(error.response.data)) {
//           try {
//             const errorText = error.response.data.toString('utf8');
//             console.error("Error response data (buffer):", errorText);
//           } catch (e) {
//             console.error("Could not convert error response to string");
//           }
//         }
//       }

//       return NextResponse.json(
//         {
//           error: "Failed to convert text to speech",
//           details: error.message,
//           statusCode: error.response?.status
//         },
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





import { NextResponse } from 'next/server';
import axios from 'axios';

// In-memory storage for audio files
const audioCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request) {
  try {
    console.log("Starting ElevenLabs API request");

    const { text, id, voiceId, modelId, stability, clarity, style } = await request.json();

    // Check API key
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("Missing ElevenLabs API key");
      return NextResponse.json(
        { error: "Missing API key. Please set the ELEVENLABS_API_KEY environment variable." },
        { status: 500 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // Generate a unique identifier
    const audioId = id || crypto.randomUUID();
    console.log(`Generated audio ID: ${audioId}`);

    // Default voice IDs
    const VOICE_OPTIONS = {
      "rachel": "21m00Tcm4TlvDq8ikWAM",
      "domi": "AZnzlk1XvdvUeBnXmlld",
      "bella": "EXAVITQu4vr4xnSDxMaL",
      "antoni": "ErXwobaYiN019PkySvjV",
      "elli": "MF3mGyEYCl7XYWbV9V6O",
      "josh": "TxGEqnHWrfWFTfGW9XjX",
      "arnold": "VR6AewLTigWG4xSOukaG",
      "adam": "pNInz6obpgDQGcFmaJgB",
      "sam": "yoZ06aMxZJJ28mfd3POQ"
    };

    // Use the selected voice or default to "josh"
    const selectedVoiceId = VOICE_OPTIONS[voiceId] || voiceId || VOICE_OPTIONS.josh;
    console.log(`Selected voice ID: ${selectedVoiceId}`);

    // Set model and voice parameters
    const selectedModelId = modelId || "eleven_multilingual_v2";
    const voiceSettings = {
      stability: stability !== undefined ? stability : 0.5,
      similarity_boost: clarity !== undefined ? clarity : 0.75,
      style: style !== undefined ? style : 0,
      use_speaker_boost: true
    };

    console.log("Voice settings:", voiceSettings);

    try {
      console.log("Sending request to ElevenLabs API...");

      // Make API request to ElevenLabs
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        data: {
          text,
          model_id: selectedModelId,
          voice_settings: voiceSettings
        },
        responseType: 'arraybuffer'
      });

      console.log("Received response from ElevenLabs API");

      // Verify we got audio data
      if (!response.data || response.data.length === 0) {
        console.error("No audio data received");
        return NextResponse.json(
          { error: "No audio data received from ElevenLabs" },
          { status: 500 }
        );
      }

      // Store audio data in memory cache
      const audioBuffer = Buffer.from(response.data);
      const voiceName = Object.keys(VOICE_OPTIONS).find(key => VOICE_OPTIONS[key] === selectedVoiceId) || voiceId;
      
      const cacheEntry = {
        buffer: audioBuffer,
        contentType: 'audio/mpeg',
        filename: `speech_${audioId}.mp3`,
        createdAt: Date.now(),
        voiceId: selectedVoiceId,
        voiceName: voiceName,
        voiceSettings: voiceSettings
      };

      audioCache.set(audioId, cacheEntry);
      console.log(`Successfully cached audio with ID: ${audioId}`);

      // Clean up old cache entries
      cleanupOldCache();

      // Generate download URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`;
      const downloadUrl = `${baseUrl}/api/audio/download/${audioId}`;

      return NextResponse.json({
        success: true,
        message: "Audio file generated successfully",
        audioId: audioId,
        downloadUrl: downloadUrl,
        audioUrl: downloadUrl, // For backward compatibility
        voiceId: selectedVoiceId,
        voiceName: voiceName,
        filename: cacheEntry.filename,
        size: audioBuffer.length,
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error("TTS conversion error:", error);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);

        if (error.response.data && !Buffer.isBuffer(error.response.data)) {
          console.error("Error response data:", error.response.data);
        } else if (Buffer.isBuffer(error.response.data)) {
          try {
            const errorText = error.response.data.toString('utf8');
            console.error("Error response data (buffer):", errorText);
          } catch (e) {
            console.error("Could not convert error response to string");
          }
        }
      }

      return NextResponse.json(
        {
          error: "Failed to convert text to speech",
          details: error.message,
          statusCode: error.response?.status
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

// Function to clean up old cache entries
function cleanupOldCache() {
  const now = Date.now();
  for (const [key, entry] of audioCache.entries()) {
    if (now - entry.createdAt > CACHE_DURATION) {
      audioCache.delete(key);
      console.log(`Cleaned up expired audio cache entry: ${key}`);
    }
  }
}

// Export the cache for use in download endpoint
export { audioCache };
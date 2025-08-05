import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

// Ensure directory exists for storing audio files locally
const AUDIO_DIR = process.env.AUDIO_DIR || path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

export async function POST(request) {
  try {
    const { text, id } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const filename = `speech_${id || Date.now()}.mp3`;
    const outputPath = path.join(AUDIO_DIR, filename);
    const wavOutputPath = outputPath.replace(/\.mp3$/, '.wav');

    try {
      // Sanitize text for command line safety
      const sanitizedText = text.replace(/(["\s'$`\\])/g, '\\$1');

      // Try a simple approach: use built-in say command on macOS,
      // espeak on Linux, or PowerShell on Windows
      let command;
      let skipFfmpeg = false;

      if (process.platform === 'darwin') {
        // macOS
        const tempFile = path.join(os.tmpdir(), `text_${Date.now()}.txt`);
        fs.writeFileSync(tempFile, text);

        // Try to use ffmpeg if available
        try {
          execSync('ffmpeg -version', { stdio: 'ignore' });
          command = `say -f "${tempFile}" -o "${outputPath.replace(/\.mp3$/, '')}.aiff" && ffmpeg -i "${outputPath.replace(/\.mp3$/, '')}.aiff" -acodec libmp3lame "${outputPath}"`;
        } catch (e) {
          // If ffmpeg is not available, just use say
          command = `say -f "${tempFile}" -o "${outputPath.replace(/\.mp3$/, '')}.aiff"`;
          skipFfmpeg = true;
        }
      } else if (process.platform === 'linux') {
        // Linux
        const tempFile = path.join(os.tmpdir(), `text_${Date.now()}.txt`);
        fs.writeFileSync(tempFile, text);

        // Try to use ffmpeg if available
        try {
          execSync('ffmpeg -version', { stdio: 'ignore' });
          command = `espeak -f "${tempFile}" --stdout | ffmpeg -i - -ar 44100 -ac 2 -ab 192k -f mp3 "${outputPath}"`;
        } catch (e) {
          // If ffmpeg is not available, just use espeak
          command = `espeak -f "${tempFile}" -w "${wavOutputPath}"`;
          skipFfmpeg = true;
        }
      } else if (process.platform === 'win32') {
        // Windows
        // Create a safer PowerShell script
        const tempFile = path.join(os.tmpdir(), `text_${Date.now()}.txt`);
        const psScript = path.join(os.tmpdir(), `speech_${Date.now()}.ps1`);

        fs.writeFileSync(tempFile, text);
        fs.writeFileSync(psScript, `
          Add-Type -AssemblyName System.Speech
          $synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer
          $synthesizer.SetOutputToWaveFile("${wavOutputPath}")
          $synthesizer.Speak([System.IO.File]::ReadAllText("${tempFile}"))
          $synthesizer.Dispose()
        `);

        // Execute PowerShell script to create WAV file
        command = `powershell -ExecutionPolicy Bypass -File "${psScript}"`;

        // Try to use ffmpeg if available
        try {
          execSync('ffmpeg -version', { stdio: 'ignore' });
          command += ` && ffmpeg -i "${wavOutputPath}" -acodec libmp3lame "${outputPath}"`;
        } catch (e) {
          // If ffmpeg is not available, just use the WAV file
          skipFfmpeg = true;
        }
      } else {
        throw new Error(`Unsupported platform: ${process.platform}`);
      }

      execSync(command, { stdio: 'pipe' });

      // Return the public URL path for the audio file
      const fileExtension = skipFfmpeg ? (process.platform === 'darwin' ? '.aiff' : '.wav') : '.mp3';
      const actualPath = skipFfmpeg ? outputPath.replace(/\.mp3$/, fileExtension) : outputPath;
      const audioUrl = `/audio/${path.basename(actualPath)}`;

      return NextResponse.json({
        success: true,
        message: "Audio file generated successfully",
        audioUrl: audioUrl,
        localPath: actualPath,
        format: skipFfmpeg ? fileExtension.replace('.', '') : 'mp3'
      });

    } catch (commandError) {
      console.error("System TTS conversion error:", commandError);

      // Fallback to a simpler approach - creating a placeholder audio file
      try {
        // Create a minimal valid MP3 file
        const placeholderMP3 = Buffer.from([
          0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]);
        fs.writeFileSync(outputPath, placeholderMP3);

        return NextResponse.json({
          success: true,
          message: "Created placeholder audio file.",
          audioUrl: `/audio/${filename}`,
          localPath: outputPath,
          isPlaceholder: true
        });
      } catch (fallbackError) {
        console.error("Fallback audio creation error:", fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
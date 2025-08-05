import { NextResponse } from 'next/server';
import { audioCache } from '../../route.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Audio ID is required" },
        { status: 400 }
      );
    }

    console.log(`Attempting to download audio with ID: ${id}`);

    // Retrieve audio data from cache
    const audioData = audioCache.get(id);

    if (!audioData) {
      console.log(`Audio file not found for ID: ${id}`);
      return NextResponse.json(
        { error: "Audio file not found or has expired" },
        { status: 404 }
      );
    }

    console.log(`Found audio file for ID: ${id}, size: ${audioData.buffer.length} bytes`);

    // Create response with audio buffer
    const response = new NextResponse(audioData.buffer, {
      status: 200,
      headers: {
        'Content-Type': audioData.contentType,
        'Content-Disposition': `attachment; filename="${audioData.filename}"`,
        'Content-Length': audioData.buffer.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return response;

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download audio file" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from 'next/server';
// import { audioCache } from '../../route.js';

// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Audio ID is required" },
//         { status: 400 }
//       );
//     }

//     console.log(`Attempting to download audio with ID: ${id}`);

//     // Retrieve audio data from cache
//     const audioData = audioCache.get(id);

//     if (!audioData) {
//       console.log(`Audio file not found for ID: ${id}`);
//       return NextResponse.json(
//         { error: "Audio file not found or has expired" },
//         { status: 404 }
//       );
//     }

//     console.log(`Found audio file for ID: ${id}, size: ${audioData.buffer.length} bytes`);

//     // Create response with audio buffer
//     const response = new NextResponse(audioData.buffer, {
//       status: 200,
//       headers: {
//         'Content-Type': audioData.contentType,
//         'Content-Disposition': `attachment; filename="${audioData.filename}"`,
//         'Content-Length': audioData.buffer.length.toString(),
//         'Cache-Control': 'no-store, no-cache, must-revalidate',
//         'Pragma': 'no-cache',
//         'Expires': '0'
//       }
//     });

//     return response;

//   } catch (error) {
//     console.error("Download error:", error);
//     return NextResponse.json(
//       { error: "Failed to download audio file" },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Import the cache dynamically to avoid import issues
    let audioCache;
    try {
      const module = await import('../../route.js');
      audioCache = module.audioCache;
    } catch (importError) {
      console.error('Failed to import audioCache:', importError);
      return NextResponse.json(
        { error: "Internal server error - cache not available" },
        { status: 500 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Audio ID is required" },
        { status: 400 }
      );
    }

    console.log(`Attempting to download audio with ID: ${id}`);
    console.log(`Cache has ${audioCache ? audioCache.size : 0} items`);

    if (!audioCache) {
      return NextResponse.json(
        { error: "Audio cache not initialized" },
        { status: 500 }
      );
    }

    // Retrieve audio data from cache
    const audioData = audioCache.get(id);

    if (!audioData) {
      console.log(`Audio file not found for ID: ${id}`);
      console.log('Available IDs in cache:', Array.from(audioCache.keys()));
      return NextResponse.json(
        { 
          error: "Audio file not found or has expired",
          availableIds: Array.from(audioCache.keys())
        },
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
      { 
        error: "Failed to download audio file",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
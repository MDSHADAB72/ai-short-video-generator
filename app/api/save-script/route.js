// File: /app/api/save-script/route.js
import { NextResponse } from 'next/server';
import { db } from "@/configs/db";
import { Scripts } from "@/configs/schema";

export async function POST(request) {
  try {
    const scriptData = await request.json();

    // Validate required fields
    if (!scriptData.id || !scriptData.content) {
      return NextResponse.json(
        { error: "Missing required fields: id and content are required" },
        { status: 400 }
      );
    }

    console.log("Saving script data to database:", {
      id: scriptData.id,
      contentLength: scriptData.content?.length || 0,
      audioUrl: scriptData.audioUrl,
      userId: scriptData.userId
    });

    // Save the script data to the database
    await db.insert(Scripts).values({
      id: scriptData.id,
      userId: scriptData.userId || null,
      content: scriptData.content,
      audioUrl: scriptData.audioUrl,
      localPath: scriptData.localPath,
      voiceSettings: scriptData.voiceSettings,
      audioGenerated: scriptData.audioGenerated || false,
    });

    console.log("Script saved successfully to database with ID:", scriptData.id);

    return NextResponse.json({
      success: true,
      message: "Script saved successfully to database",
      id: scriptData.id
    });
  } catch (error) {
    console.error("Error saving script to database:", error);

    // Handle specific database errors
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: "Script with this ID already exists" },
        { status: 409 }
      );
    }

    if (error.message?.includes('foreign key')) {
      return NextResponse.json(
        { error: "Invalid user ID provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save script to database. Please try again." },
      { status: 500 }
    );
  }
}
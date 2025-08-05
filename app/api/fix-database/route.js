// import { NextResponse } from 'next/server';
// import { db } from "@/configs/db";

// export async function POST() {
//     try {
//         console.log("Fixing database schema...");

//         // Manually alter the user_id column to varchar
//         await db.execute(`
//       ALTER TABLE "scripts" 
//       ALTER COLUMN "user_id" TYPE varchar(255);
//     `);

//         console.log("Database schema fixed successfully");

//         return NextResponse.json({
//             success: true,
//             message: "Database schema fixed - user_id column is now varchar"
//         });
//     } catch (error) {
//         console.error("Error fixing database schema:", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 error: error.message
//             },
//             { status: 500 }
//         );
//     }
// } 





import { NextResponse } from 'next/server';
import { db } from "@/configs/db";

export async function POST() {
    try {
        console.log("Fixing database schema...");

        // Manually alter the user_id column to varchar
        await db.execute(`
      ALTER TABLE "scripts" 
      ALTER COLUMN "user_id" TYPE varchar(255);
    `);

        console.log("Database schema fixed successfully");

        return NextResponse.json({
            success: true,
            message: "Database schema fixed - user_id column is now varchar"
        });
    } catch (error) {
        console.error("Error fixing database schema:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );
    }
} 
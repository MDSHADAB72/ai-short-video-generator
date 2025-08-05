import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql", // Use the PostgreSQL dialect
    schema: "./configs/schema.js", // Path to your schema file
    dbCredentials: {
        url: 'postgresql://neondb_owner:T2bwuiIOMl5m@ep-autumn-rice-a5rnxj8o.us-east-2.aws.neon.tech/neondb?sslmode=require',
    },
});

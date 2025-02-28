// db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

// Don't log the connection string in production
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined");
  throw new Error("DATABASE_URL is not defined");
}

// Configure connection pool settings for serverless environment
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client, { schema });

export default db;

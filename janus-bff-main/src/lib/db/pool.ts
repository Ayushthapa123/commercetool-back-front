import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || "mydb",
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
  ssl: {
    // TODO shouldn't be like this in prod
    rejectUnauthorized: false,
  },
});

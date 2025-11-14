import { pool } from "@/lib/db/pool";
import { logger } from "@/lib/logger";

export async function generateOrderNumber(): Promise<string> {
  const result = await pool.query(
    "SELECT nextval('ordernumbers_seq') as ordernumber",
  );
  const orderNumber = result.rows[0].ordernumber.toString();
  logger.info(`Generated order number: ${orderNumber}`);
  return orderNumber;
}

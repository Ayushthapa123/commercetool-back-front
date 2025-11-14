import { logger } from "@/lib/logger";
import { getClientIPFromReq, isPublicIP } from "@/lib/utils";
import { WebServiceClient } from "@maxmind/geoip2-node";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

let instance: WebServiceClient | null = null;
function getMaxMindWebServiceClient(): WebServiceClient {
  if (!instance) {
    const { MAXMIND_LICENSE_KEY } = process.env;
    if (!MAXMIND_LICENSE_KEY) {
      throw new Error("Missing required maxmind credential for BFF");
    }
    const MAXMIND_ACCOUNT_ID = process.env.MAXMIND_ACCOUNT_ID || "1208791";

    instance = new WebServiceClient(MAXMIND_ACCOUNT_ID, MAXMIND_LICENSE_KEY, {
      host: "geolite.info",
    });
  }

  return instance;
}

// Handle GET requests to the /api/geoip endpoint
// This function retrieves the country and continent information based on the IP address
// If the IP address is not provided, it defaults to localhost (127.0.0.1)
// It returns a JSON response with the country and continent codes or null if not found
// In case of an error, it logs the error and returns a 500 status with null
/**
 * Retrieves the country and continent based on the IP address
 *
 * @param request the request object
 * @return object with country and continent codes
 * @throws 500 Internal Server Error if the GeoIP lookup fails
 */
export async function GET(req: Request) {
  const ip = getClientIPFromReq(req);

  if (!isPublicIP(ip)) {
    logger.warn(`GeoIP lookup skipped for non-public IP: ${ip}`);
    return NextResponse.json({ country: null, continent: null });
  }

  try {
    const response = await getMaxMindWebServiceClient().country(ip);
    const country = response.country?.isoCode || null;
    const continent = response.continent?.code || null;
    return NextResponse.json({ country, continent });
  } catch (error) {
    logger.error(error, `GeoIP lookup failed for IP: ${ip}`);
    return NextResponse.json(
      { country: null, continent: null },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}

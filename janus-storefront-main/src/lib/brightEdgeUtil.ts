"use server";

import { logError } from "@/lib/logger";
import axios from "axios";

function getPageHash(url: string): string {
  let hash = 0;
  if (!url) return "0";

  for (let i = 0; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash < 0 ? "0" + -hash : "" + hash;
}

export async function fetchCapsuleData(pageUrl: string, accountId: string) {
  const pageHash = getPageHash(pageUrl);
  const capsuleUrl = `https://ixfd1-api.bc0a.com/api/ixf/1.0.0/get_capsule/${accountId}/${pageHash}`;

  try {
    const response = await axios.get(capsuleUrl);
    return response.data;
  } catch (error) {
    logError(error, `Error fetching BrightEdge capsule: ${pageUrl}`);
    return {};
  }
}

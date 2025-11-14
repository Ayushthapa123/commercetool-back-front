import { HttpStatusCode } from "axios";

export async function GET() {
  return Response.json({ status: HttpStatusCode[HttpStatusCode.Ok] });
}

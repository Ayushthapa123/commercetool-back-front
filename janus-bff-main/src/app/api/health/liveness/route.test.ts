import { HttpStatusCode } from "axios";
import { expect, it } from "vitest";
import * as route from "./route";

it("GET Handler - happy path", async () => {
  const res = await route.GET();
  const json = res instanceof Response ? await res.json() : res;
  expect(json).toEqual({ status: HttpStatusCode[HttpStatusCode.Ok] });
});

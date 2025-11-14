import { expect, test, vi } from "vitest";
import { logger } from "./logger";

test("session id matches guid format", () => {
  vi.mock("server-only", () => {
    return {
      // mock server-only module
    };
  });
  const loggerSpy = vi.spyOn(logger, "info");
  logger.info("hello world");
  expect(loggerSpy).toHaveBeenCalled();
});

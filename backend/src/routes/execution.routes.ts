import { Router } from "express";

import { executionRateLimiter } from "../middleware/rate-limit";
import { validate } from "../middleware/validate";
import { ExecuteSchema } from "../schemas/execution";
import { judge0Service } from "../services/judge0.service";
import { asyncHandler } from "../utils/async-handler";

export const executionRouter = Router();

executionRouter.post(
  "/",
  executionRateLimiter,
  validate(ExecuteSchema),
  asyncHandler(async (request, response) => {
    const { language, sourceCode, stdin, timeLimitMs, memoryLimitKb } = request.body;
    const result = await judge0Service.run({ language, sourceCode, stdin, timeLimitMs, memoryLimitKb });
    response.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      time: result.time,
      memory: result.memory,
      status: result.status,
    });
  }),
);

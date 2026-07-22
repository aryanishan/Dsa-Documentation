import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error-handler";
import { apiRateLimiter } from "./middleware/rate-limit";
import { requestId } from "./middleware/request-id";
import { adminRouter } from "./routes/admin.routes";
import { authRouter } from "./routes/auth.routes";
import { bookmarkRouter } from "./routes/bookmark.routes";
import { executionRouter } from "./routes/execution.routes";
import { noteRouter } from "./routes/note.routes";
import { problemRouter } from "./routes/problem.routes";
import { progressRouter } from "./routes/progress.routes";
import { searchRouter } from "./routes/search.routes";
import { submissionRouter } from "./routes/submission.routes";
import { topicRouter } from "./routes/topic.routes";
import { userRouter } from "./routes/user.routes";

const app = express();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

if (env.trustProxy) app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(requestId);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(apiRateLimiter);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/health", (_request, response) => {
  response.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

const prefix = env.API_PREFIX;

app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/executions`, executionRouter);
app.use(`${prefix}/users`, userRouter);
app.use(`${prefix}/topics`, topicRouter);
app.use(`${prefix}/problems`, problemRouter);
app.use(`${prefix}/submissions`, submissionRouter);
app.use(`${prefix}/bookmarks`, bookmarkRouter);
app.use(`${prefix}/notes`, noteRouter);
app.use(`${prefix}/progress`, progressRouter);
app.use(`${prefix}/search`, searchRouter);
app.use(`${prefix}/admin`, adminRouter);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(env.PORT, () => {
  console.log(`[server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  console.log(`[server] API prefix: ${env.API_PREFIX}`);
  console.log(`[server] CORS origins: ${env.corsOrigins.join(", ")}`);
  console.log(`[server] Judge0 base URL: ${env.JUDGE0_BASE_URL}`);
});

export default app;

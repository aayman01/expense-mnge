import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { connectToDatabase } from "./setup/mongo";
import expenseRouter from "./routes/expenses";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(compression());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "expense-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/expenses", expenseRouter);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

const port = Number(process.env.PORT || 4000);

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", error);
    process.exit(1);
  });

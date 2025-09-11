import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import User from "../models/User";
import { signToken } from "../middleware/auth";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", async (req: Request, res: Response) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid payload" });
  const { email, password } = parsed.data;
  const existing = await User.findOne({ email }).lean();
  if (existing)
    return res.status(409).json({ message: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  const token = signToken({ userId: String(user._id) });
  res.status(201).json({ token });
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid payload" });
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken({ userId: String(user._id) });
  res.json({ token });
});

// Demo login without credentials (for previews). Enable by setting ALLOW_DEMO_AUTH=true
router.post("/demo", async (_req: Request, res: Response) => {
  if (process.env.ALLOW_DEMO_AUTH !== "true")
    return res.status(404).json({ message: "Not found" });
  const token = signToken({ userId: "demo" });
  return res.json({ token });
});

export default router;

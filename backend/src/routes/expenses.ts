import { Router, Request, Response } from "express";
import { z } from "zod";
import Expense from "../models/Expense";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().nonnegative(),
  category: z.string().min(1),
  date: z.string().transform((v) => new Date(v)),
  notes: z.string().optional(),
});

router.get("/", async (req: Request, res: Response) => {
  const { start, end } = req.query as { start?: string; end?: string };
  const query: any = { ownerId: req.auth!.userId };
  if (start || end) {
    query.date = {} as any;
    if (start) (query.date as any).$gte = new Date(start as string);
    if (end) (query.date as any).$lte = new Date(end as string);
  }
  const items = await Expense.find(query)
    .sort({ date: -1, createdAt: -1 })
    .lean();
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = expenseSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Invalid payload", errors: parsed.error.flatten() });
  const created = await Expense.create({
    ...parsed.data,
    ownerId: req.auth!.userId,
  });
  res.status(201).json(created);
});

router.get("/:id", async (req: Request, res: Response) => {
  const item = await Expense.findOne({
    _id: req.params.id,
    ownerId: req.auth!.userId,
  }).lean();
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

router.put("/:id", async (req: Request, res: Response) => {
  const parsed = expenseSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Invalid payload", errors: parsed.error.flatten() });
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.auth!.userId },
    parsed.data,
    { new: true, runValidators: true }
  ).lean();
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const deleted = await Expense.findOneAndDelete({
    _id: req.params.id,
    ownerId: req.auth!.userId,
  }).lean();
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;

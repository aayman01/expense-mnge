"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Expense_1 = __importDefault(require("../models/Expense"));
const router = (0, express_1.Router)();
const expenseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    amount: zod_1.z.number().nonnegative(),
    category: zod_1.z.string().min(1),
    date: zod_1.z.string().transform((v) => new Date(v)),
    notes: zod_1.z.string().optional(),
});
router.get('/', async (_req, res) => {
    const items = await Expense_1.default.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json(items);
});
router.post('/', async (req, res) => {
    const parsed = expenseSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
    const created = await Expense_1.default.create(parsed.data);
    res.status(201).json(created);
});
router.get('/:id', async (req, res) => {
    const item = await Expense_1.default.findById(req.params.id).lean();
    if (!item)
        return res.status(404).json({ message: 'Not found' });
    res.json(item);
});
router.put('/:id', async (req, res) => {
    const parsed = expenseSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
    const updated = await Expense_1.default.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean();
    if (!updated)
        return res.status(404).json({ message: 'Not found' });
    res.json(updated);
});
router.delete('/:id', async (req, res) => {
    const deleted = await Expense_1.default.findByIdAndDelete(req.params.id).lean();
    if (!deleted)
        return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
});
exports.default = router;

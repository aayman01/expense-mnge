import mongoose, { Schema, Document, Model } from "mongoose";

export interface ExpenseDocument extends Document {
  title: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema<ExpenseDocument> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
    ownerId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const Expense: Model<ExpenseDocument> =
  mongoose.models.Expense ||
  mongoose.model<ExpenseDocument>("Expense", ExpenseSchema);

export default Expense;

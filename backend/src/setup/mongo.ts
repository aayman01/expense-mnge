import mongoose from "mongoose";

export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/expense_db";
  mongoose.set("strictQuery", true);
  return mongoose.connect(mongoUri);
}

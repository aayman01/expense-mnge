"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToDatabase() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_db';
    mongoose_1.default.set('strictQuery', true);
    return mongoose_1.default.connect(mongoUri);
}

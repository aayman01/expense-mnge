"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("./setup/mongo");
const expenses_1 = __importDefault(require("./routes/expenses"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express_1.default.json());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'expense-api' });
});
app.use('/api/expenses', expenses_1.default);
// Global error handler
app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
});
const port = Number(process.env.PORT || 4000);
(0, mongo_1.connectToDatabase)()
    .then(() => {
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${port}`);
    });
})
    .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
});

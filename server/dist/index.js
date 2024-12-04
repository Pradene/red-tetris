"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_BUILD_FOLDER = path_1.default.join(__dirname, '../../client/build');
if (process.env.MODE === "production") {
    app.use(express_1.default.static(CLIENT_BUILD_FOLDER));
}
app.get('*', (req, res) => {
    if (process.env.MODE === "production") {
        res.sendFile(path_1.default.join(CLIENT_BUILD_FOLDER, '/index.html'));
    }
    else {
        res.send('React app is not built yet.');
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

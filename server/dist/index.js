"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3001;
const CLIENT_BUILD_FOLDER = path_1.default.join(__dirname, '../../client/build');
app.use(express_1.default.static(CLIENT_BUILD_FOLDER));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(CLIENT_BUILD_FOLDER, '/index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
require("./socket/io");
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    server_1.server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

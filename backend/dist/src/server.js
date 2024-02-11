/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = validateEnv_1.default.PORT;
const uri = validateEnv_1.default.MONGODB_URI; // Asserting that it's a string
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("Mongoose Connected");
    app_1.default.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch(console.error);

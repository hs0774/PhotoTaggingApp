/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
function initializeMongoServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = validateEnv_1.default.MONGODB_URI;
        mongoose_1.default.connect(mongoUri);
        mongoose_1.default.connection.on("error", e => {
            if (e.message.code === "ETIMEDOUT") {
                console.log(e);
                mongoose_1.default.connect(mongoUri);
            }
            console.log(e);
        });
        mongoose_1.default.connection.once("open", () => {
            console.log(`MongoDB successfully connected `);
        });
    });
}
exports.default = initializeMongoServer;

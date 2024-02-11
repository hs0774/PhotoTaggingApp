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
exports.scores = void 0;
require("dotenv/config");
const user_1 = __importDefault(require("../models/user"));
const game_1 = __importDefault(require("../models/game"));
const scores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [games, user] = yield Promise.all([
            game_1.default.find().select('_id gameName').exec(),
            user_1.default.find().exec(),
        ]);
        res.status(200).json({ games: games, user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.scores = scores;

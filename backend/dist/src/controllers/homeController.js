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
exports.index = void 0;
const game_1 = __importDefault(require("../models/game"));
const character_1 = __importDefault(require("../models/character"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [game, character] = yield Promise.all([
            game_1.default.find().populate('characters').exec(),
            character_1.default.find().exec(),
        ]);
        const gamesData = game.map((games) => {
            const imageBuffer = Buffer.from(games.picture.buffer);
            const base64Image = imageBuffer.toString('base64');
            const imageDataURL = `data:image/jpeg;base64,${base64Image}`;
            return {
                _id: games._id,
                gameName: games.gameName,
                picture: imageDataURL,
                characters: games.characters,
            };
        });
        res.status(200).json({ game: gamesData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.index = index;

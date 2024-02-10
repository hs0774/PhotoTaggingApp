"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
var mongoose_1 = require("mongoose");

var GameSchema = new mongoose_1.Schema({
    gameName: { type: String, required: true },
    picture: { type: Buffer, required: true },
    characters: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Character',
        }
    ],
});
GameSchema.virtual("url").get(function () {
    return "/api/v1/game/".concat(this._id);
});
var Game = mongoose_1.default.model('Game', GameSchema);
exports.default = Game;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
var mongoose_1 = require("mongoose");

var UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    gameScores: [
        {
            gameId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Game',
            },
            score: String,
        }
    ],
});
var User = mongoose_1.default.model('User', UserSchema);
exports.default = User;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
var mongoose_1 = require("mongoose");

var CharacterSchema = new mongoose_1.Schema({
    name: { type: String, required: true, maxlength: 35 }, // Use 'maxlength' for name field
    coords: [{ type: Number }], // Define coords as an array of numbers
    clicked: { type: Boolean, default: false },
});
var Character = mongoose_1.default.model('Character', CharacterSchema);
exports.default = Character;

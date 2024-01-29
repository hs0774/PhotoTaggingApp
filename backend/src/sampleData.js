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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// #! /usr/bin/env node
require("dotenv/config");
// var validateEnv_1 = require("./util/validateEnv");
import validateEnv_1 from "./util/validateEnv"
import mongoose_1 from "mongoose";
import fs from "fs";
import game_1 from "./models/game";
import character_1 from "./models/character";
import user_1 from "./models/user";

// var mongoose_1 = require("mongoose");
// var fs = require("fs");
// var game_1 = require("./models/game");
// var character_1 = require("./models/character");
// var user_1 = require("./models/user");
console.log('This script populates some test items to your database');
// Get arguments passed on command line
//const userArgs = process.argv.slice(2);  
var gamesArr = [];
var charactersArr = [];
var usersArr = [];
mongoose_1.default.set('strictQuery', false);
var mongoDB = validateEnv_1.default.MONGODB_URI;
main().catch(function (err) { return console.log(err); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Debug: About to connect");
                    return [4 /*yield*/, mongoose_1.default.connect(mongoDB)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, createCharacters()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createGames()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, createUsers()];
                case 4:
                    _a.sent();
                    console.log("Debug: Closing Mongoose");
                    mongoose_1.default.connection.close();
                    return [2 /*return*/];
            }
        });
    });
}
function gameCreate(index, gameName, picture, characters) {
    return __awaiter(this, void 0, void 0, function () {
        var gameDetail, game, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2,  3]);
                    gameDetail = {
                        gameName: gameName,
                        picture: picture,
                        characters: characters,
                    };
                    game = new game_1.default(gameDetail);
                    return [4 /*yield*/, game.save()];
                case 1:
                    _a.sent();
                    gamesArr[index] = game;
                    console.log("Added game ".concat(gameName));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error creating game ".concat(gameName), error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function characterCreate(index, name, coords) {
    return __awaiter(this, void 0, void 0, function () {
        var characterDetail, character, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2,  3]);
                    characterDetail = {
                        name: name,
                        coords: coords,
                    };
                    character = new character_1.default(characterDetail);
                    return [4 /*yield*/, character.save()];
                case 1:
                    _a.sent();
                    charactersArr[index] = character;
                    console.log("Added character ".concat(name));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error creating character ".concat(name), error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function userCreate(index, username, gameScores) {
    return __awaiter(this, void 0, void 0, function () {
        var userDetail, user, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2,  3]);
                    userDetail = {
                        username: username,
                        gameScores: gameScores,
                    };
                    user = new user_1.default(userDetail);
                    return [4 /*yield*/, user.save()];
                case 1:
                    _a.sent();
                    usersArr[index] = user;
                    console.log("User ".concat(username, " added"));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error creating user ".concat(username), error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createGames() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Adding games");
                    return [4 /*yield*/, Promise.all([
                            gameCreate(0, 'Spot The Chick', fs.readFileSync('../src/public/images/spotTheChick.jpg'), [charactersArr[0]]),
                            gameCreate(1, 'Creepy Find 4', fs.readFileSync('../src/public/images/hidden-objects.png'), [charactersArr[1], charactersArr[2], charactersArr[3], charactersArr[4]]),
                            gameCreate(2, 'Sunny Find 7', fs.readFileSync('../src/public/images/waldo3.png'), [charactersArr[5], charactersArr[6], charactersArr[7], charactersArr[8], charactersArr[9], charactersArr[10], charactersArr[11]]),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createCharacters() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Adding characters");
                    return [4 /*yield*/, Promise.all([
                            characterCreate(0, 'Chick', [530, 500, 34]),
                            characterCreate(1, 'Umbrella', [894, 514, 34]),
                            characterCreate(2, 'Spider', [1786, 422, 34]),
                            characterCreate(3, 'Rat', [639, 886, 34]),
                            characterCreate(4, 'Teddy', [858, 223, 34]),
                            characterCreate(5, 'Clock', [108, 544, 34]),
                            characterCreate(6, 'Book', [275, 832, 34]),
                            characterCreate(7, 'Well', [974, 579, 34]),
                            characterCreate(8, 'Suitcase', [678, 201, 34]),
                            characterCreate(9, 'Spray', [845, 904, 34]),
                            characterCreate(10, 'Treasure Chest', [1012, 912, 34]),
                            characterCreate(11, 'Cannon', [825, 715, 34]),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createUsers() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Adding users");
                    return [4 /*yield*/, Promise.all([
                            userCreate(0, 'Jim', [{ gameId: gamesArr[0], score: '0:24' }]), //these three played one 
                            userCreate(1, 'Bob', [{ gameId: gamesArr[1], score: '0:44' }]),
                            userCreate(2, 'Bill', [{ gameId: gamesArr[2], score: '0:58' }]),
                            userCreate(3, 'Will', [{ gameId: gamesArr[0], score: '0:24' }, { gameId: gamesArr[2], score: '0:35' }]), //played 2
                            userCreate(4, 'Anon', [{ gameId: gamesArr[0], score: '0:24' }, { gameId: gamesArr[1], score: '0:58' }, { gameId: gamesArr[2], score: '0:44' }]), //played all 3   
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}

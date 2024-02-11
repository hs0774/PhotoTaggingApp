"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// #! /usr/bin/env node
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs = __importStar(require("fs"));
const game_1 = __importDefault(require("./models/game"));
const character_1 = __importDefault(require("./models/character"));
const user_1 = __importDefault(require("./models/user"));
console.log('This script populates some test items to your database');
const gamesArr = [];
const charactersArr = [];
const usersArr = [];
mongoose_1.default.set('strictQuery', false);
const mongoDB = validateEnv_1.default.MONGODB_URI;
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Debug: About to connect");
        yield mongoose_1.default.connect(mongoDB);
        yield createCharacters();
        yield createGames();
        yield createUsers();
        console.log("Debug: Closing Mongoose");
        mongoose_1.default.connection.close();
    });
}
function gameCreate(index, gameName, picture, characters) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gameDetail = {
                gameName: gameName,
                picture: picture,
                characters: characters,
            };
            const game = new game_1.default(gameDetail);
            yield game.save();
            gamesArr[index] = game;
            console.log(`Added game ${gameName}`);
        }
        catch (error) {
            console.error(`Error creating game ${gameName}`, error);
            throw error;
        }
    });
}
function characterCreate(index, name, coords) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const characterDetail = {
                name: name,
                coords: coords,
            };
            const character = new character_1.default(characterDetail);
            yield character.save();
            charactersArr[index] = character;
            console.log(`Added character ${name}`);
        }
        catch (error) {
            console.error(`Error creating character ${name}`, error);
            throw error;
        }
    });
}
function userCreate(index, username, gameScores) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userDetail = {
                username: username,
                gameScores: gameScores,
            };
            const user = new user_1.default(userDetail);
            yield user.save();
            usersArr[index] = user;
            console.log(`User ${username} added`);
        }
        catch (error) {
            console.error(`Error creating user ${username}`, error);
            throw error;
        }
    });
}
function createGames() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Adding games");
        yield Promise.all([
            gameCreate(0, 'Spot The Chick', fs.readFileSync('../src/public/images/spotTheChick.jpg'), [charactersArr[0]]),
            gameCreate(1, 'Creepy Find 4', fs.readFileSync('../src/public/images/hidden-objects.png'), [charactersArr[1], charactersArr[2], charactersArr[3], charactersArr[4]]),
            gameCreate(2, 'Sunny Find 7', fs.readFileSync('../src/public/images/waldo3.png'), [charactersArr[5], charactersArr[6], charactersArr[7], charactersArr[8], charactersArr[9], charactersArr[10], charactersArr[11]]),
        ]);
    });
}
function createCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Adding characters");
        yield Promise.all([
            characterCreate(0, 'Chick', [530, 500, 34]),
            characterCreate(1, 'Umbrella', [894, 514, 34]),
            characterCreate(2, 'Spider', [1786, 422, 34]),
            characterCreate(3, 'Rat', [639, 886, 34]),
            characterCreate(4, 'Teddy', [858, 223, 34]),
            characterCreate(5, 'Clock', [108, 544, 34]),
            characterCreate(6, 'Book', [275, 832, 34]),
            characterCreate(7, 'Well', [974, 579, 50]),
            characterCreate(8, 'Suitcase', [678, 201, 34]),
            characterCreate(9, 'Spray', [845, 904, 34]),
            characterCreate(10, 'Treasure Chest', [1012, 912, 34]),
            characterCreate(11, 'Cannon', [825, 715, 34]),
        ]);
    });
}
function createUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Adding users");
        yield Promise.all([
            userCreate(0, 'Jim', [{ gameId: gamesArr[0], score: '00:24' }]), //these three played one 
            userCreate(1, 'Bob', [{ gameId: gamesArr[1], score: '00:44' }]),
            userCreate(2, 'Bill', [{ gameId: gamesArr[2], score: '00:58' }]),
            userCreate(3, 'Will', [{ gameId: gamesArr[0], score: '00:24' }, { gameId: gamesArr[2], score: '00:35' }]), //played 2
            userCreate(4, 'Anon', [{ gameId: gamesArr[0], score: '00:24' }, { gameId: gamesArr[1], score: '00:58' }, { gameId: gamesArr[2], score: '00:44' }]), //played all 3   
        ]);
    });
}

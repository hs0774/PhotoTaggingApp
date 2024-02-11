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

const api_1 = __importDefault(require("../src/routes/api"));
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoConfigTesting_1 = __importDefault(require("../src/mongoConfigTesting"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/', api_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.default)();
}));
// Close MongoDB Memory Server after all tests have finished
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('GET /scores', () => {
    it('should return game and user data', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/scores');
        expect(response.status).toBe(200);
        // Check if response body contains games and user arrays
        expect(response.body).toHaveProperty('games');
        expect(response.body).toHaveProperty('user');
        // Check if games array contains expected properties
        expect(Array.isArray(response.body.games)).toBe(true);
        expect(response.body.games.length).toBeGreaterThan(0);
        response.body.games.forEach((game) => {
            expect(game).toHaveProperty('_id');
            expect(typeof game._id).toBe('string');
            expect(game).toHaveProperty('gameName');
            expect(typeof game.gameName).toBe('string');
        });
        // Check if user array contains expected properties
        expect(Array.isArray(response.body.user)).toBe(true);
        expect(response.body.user.length).toBeGreaterThan(0);
        response.body.user.forEach((user) => {
            expect(user).toHaveProperty('_id');
            expect(typeof user._id).toBe('string');
            expect(user).toHaveProperty('username');
            expect(typeof user.username).toBe('string');
            expect(user).toHaveProperty('gameScores');
            expect(Array.isArray(user.gameScores)).toBe(true);
        });
    }));
});

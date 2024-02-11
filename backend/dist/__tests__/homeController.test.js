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
describe('GET /', () => {
    it('should return game data', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/');
        expect(response.status).toBe(200);
        // Check if response.body.game exists and is an array
        expect(Array.isArray(response.body.game)).toBe(true);
        // Check if the length of the array is 3
        expect(response.body.game.length).toBe(3);
        // Iterate over each game object in the array and perform property checks
        response.body.game.forEach((game) => {
            expect(game).toHaveProperty('_id');
            expect(typeof game._id).toBe('string');
            expect(game).toHaveProperty('gameName');
            expect(typeof game.gameName).toBe('string');
            expect(game).toHaveProperty('picture');
            expect(typeof game.picture).toBe('string');
            expect(game).toHaveProperty('characters');
            expect(Array.isArray(game.characters)).toBe(true);
        });
    }));
});

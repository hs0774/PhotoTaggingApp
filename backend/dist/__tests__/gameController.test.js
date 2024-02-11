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
const user_1 = __importDefault(require("../src/models/user"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', api_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoConfigTesting_1.default)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let clientStartTime;
let clientServerStartDifference;
let startTime;
let endTime;
describe('POST /timeStart', () => {
    it('should set clientServerStartDifference within an acceptable range', () => __awaiter(void 0, void 0, void 0, function* () {
        startTime = Date.now(); // Simulate client start time
        const response = yield (0, supertest_1.default)(app)
            .post('/game/startTime')
            .send({ start: startTime });
        clientStartTime = Date.now();
        clientServerStartDifference = clientStartTime - response.body.start;
        // Ensure clientServerStartDifference is within an acceptable range
        expect(response.status).toBe(200);
    }));
});
describe('POST /endTime', () => {
    it('should calculate the time from start to finish ', () => __awaiter(void 0, void 0, void 0, function* () {
        endTime = Date.now(); // Simulate server end time
        const response = yield (0, supertest_1.default)(app)
            .post('/game/endTime')
            .send({ end: endTime });
        const difference = Date.now() - startTime;
        const elapsedTime = ((response.body.end - clientStartTime) - clientServerStartDifference) - difference;
        expect(elapsedTime).toEqual(response.body.elapsedTime);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('elapsedTime');
        expect(typeof response.body.elapsedTime).toBe('object');
    }));
});
describe('POST /addOrUpdateTime', () => {
    it('should update an existing score if the new time is smaller', () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = new user_1.default({
            username: 'testUser',
            gameScores: [{ gameId: 'gameId123', score: '01:30' }],
        });
        yield existingUser.save();
        const formData = {
            username: 'testUser',
            gameId: 'gameId123',
            time: '01:20', // Smaller time
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/game/addOrUpdateTime')
            .send({ formData });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Completed');
    }));
    it('should add a new score if the user has not played the game before', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming there's an existing user with no game scores
        const existingUser = new user_1.default({ username: 'testUser', gameScores: [] });
        yield existingUser.save();
        const formData = {
            username: 'testUser',
            gameId: 'gameId123',
            time: '01:20',
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/game/addOrUpdateTime')
            .send({ formData });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Completed');
    }));
    it('should return a 404 error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const formData = {
            username: 'nonexistentUser',
            gameId: 'gameId123',
            time: '01:20',
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/game/addOrUpdateTime')
            .send({ formData });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
    }));
});
describe('POST /game/createUser', () => {
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: 'testUser',
            time: '0:30',
            gameId: 'someGameId'
        };
        // Mock User.findOne to return null, indicating that the user doesn't exist yet
        user_1.default.findOne = jest.fn().mockResolvedValue(null);
        // Mock User.save to return a new user object
        user_1.default.prototype.save = jest.fn().mockResolvedValue({
            _id: 'someUserId', // Mocked user ID
            username: userData.username,
            gameScores: [{
                    gameId: userData.gameId,
                    score: userData.time
                }]
        });
        // Perform the HTTP request to the createUser endpoint
        const response = yield (0, supertest_1.default)(app)
            .post('/game/createUser')
            .send(userData);
        // Assert that the response status is 200
        expect(response.status).toBe(200);
        // Assert that the response body contains the expected message and username
        expect(response.body).toEqual(expect.objectContaining({
            message: 'user created',
            token: expect.any(String),
            username: userData.username
        }));
        // Assert that User.findOne was called with the expected parameters
        expect(user_1.default.findOne).toHaveBeenCalledWith({ username: userData.username });
        // Assert that User.save was called with the expected user data
        expect(user_1.default.prototype.save).toHaveBeenCalledWith({
            username: userData.username,
            gameScores: [{
                    gameId: userData.gameId,
                    score: userData.time
                }]
        });
    }));
});

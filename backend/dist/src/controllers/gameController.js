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
exports.addOrUpdateTime = exports.createUser = exports.timeEnd = exports.timeStart = void 0;
require("dotenv/config");
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const createToken = (username) => {
    return jsonwebtoken_1.default.sign({ username: username }, validateEnv_1.default.SECRET);
};
let clientStartTime;
let clientServerStartDifference;
let elapsedTime = 0;
const timeStart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        clientStartTime = Date.now();
        clientServerStartDifference = clientStartTime - req.body.start;
        res.status(200).json({ message: 'Started Time' });
    }
    catch (error) {
        console.error('Could not set up start time', error);
        res.status(500).json({ message: `Could not set up start time ${error.message}` });
    }
});
exports.timeStart = timeStart;
const timeEnd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientServerEndDifference = Date.now() - req.body.endTime;
        elapsedTime = ((req.body.endTime - clientStartTime) - clientServerStartDifference) - clientServerEndDifference;
        res.status(200).json({ elapsedTime });
    }
    catch (error) {
        console.error('Could not get finish time', error);
        res.status(500).json({ message: `Could not get finish time ${error.message}` });
    }
});
exports.timeEnd = timeEnd;
exports.createUser = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ max: 35 })
        .withMessage('Username cannot exceed 35 characters'),
    (0, express_validator_1.body)('time')
        .trim(),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!req.body.formData.username || req.body.formData.username === '') {
            req.body.formData.username = 'Anon';
        }
        const existingUser = yield user_1.default.findOne({ username: req.body.formData.username });
        if (existingUser) {
            let count = 1;
            let uniqueUsername = `${req.body.formData.username}${count}`;
            while (yield user_1.default.findOne({ username: uniqueUsername })) {
                count++;
                uniqueUsername = `${req.body.formData.username}${count}`;
            }
            req.body.formData.username = uniqueUsername;
        }
        const newUser = new user_1.default({
            username: req.body.formData.username,
            gameScores: [
                {
                    gameId: req.body.formData.gameId,
                    score: req.body.formData.time,
                },
            ],
        });
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        else {
            yield newUser.save();
            const token = createToken(req.body.formData.username);
            res.status(200).json({ message: 'user created', token, username: req.body.formData.username });
        }
    }))
];
exports.addOrUpdateTime = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.body.formData.username });
        if (user && req.body.formData.time !== '') {
            const played = user === null || user === void 0 ? void 0 : user.gameScores.findIndex(id => id.gameId.toString() === req.body.formData.gameId);
            if (played !== -1) {
                if (req.body.formData.time.localeCompare(user.gameScores[played].score) === -1) {
                    user.gameScores[played].score = req.body.formData.time;
                }
            }
            else {
                user.gameScores.push({
                    gameId: req.body.formData.gameId,
                    score: req.body.formData.time,
                });
            }
            yield user.save();
            res.status(200).json({ message: 'Completed' });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

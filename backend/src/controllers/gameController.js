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
exports.addOrUpdateTime = exports.createUser = exports.timeEnd = exports.timeStart = void 0;
require("dotenv/config");
var validateEnv_1 = require("../util/validateEnv");
var express_async_handler_1 = require("express-async-handler");
var express_validator_1 = require("express-validator");
var jsonwebtoken_1 = require("jsonwebtoken");
var user_1 = require("../models/user");
var createToken = function (username) {
    return jsonwebtoken_1.default.sign({ username: username }, validateEnv_1.default.SECRET);
};
var clientStartTime;
var clientServerStartDifference;
var elapsedTime = 0;
var timeStart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            clientStartTime = Date.now();
            clientServerStartDifference = clientStartTime - req.body.start;
            res.status(200).json({ message: 'Started Time' });
        }
        catch (error) {
            console.error('Could not set up start time', error);
            res.status(500).json({ message: "Could not set up start time ".concat(error.message) });
        }
        return [2 /*return*/];
    });
}); };
exports.timeStart = timeStart;
var timeEnd = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientServerEndDifference;
    return __generator(this, function (_a) {
        try {
            clientServerEndDifference = Date.now() - req.body.endTime;
            elapsedTime = ((req.body.endTime - clientStartTime) - clientServerStartDifference) - clientServerEndDifference;
            res.status(200).json({ elapsedTime: elapsedTime });
        }
        catch (error) {
            console.error('Could not get finish time', error);
            res.status(500).json({ message: "Could not get finish time ".concat(error.message) });
        }
        return [2 /*return*/];
    });
}); };
exports.timeEnd = timeEnd;
exports.createUser = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ max: 35 })
        .withMessage('Username cannot exceed 35 characters'),
    (0, express_validator_1.body)('time')
        .trim(),
    (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var errors, existingUser, count, uniqueUsername, newUser, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = (0, express_validator_1.validationResult)(req);
                    if (!req.body.formData.username || req.body.formData.username === '') {
                        req.body.formData.username = 'Anon';
                    }
                    return [4 /*yield*/, user_1.default.findOne({ username: req.body.formData.username })];
                case 1:
                    existingUser = _a.sent();
                    if (!existingUser) return [3 /*break*/, 5];
                    count = 1;
                    uniqueUsername = "".concat(req.body.formData.username).concat(count);
                    _a.label = 2;
                case 2: return [4 /*yield*/, user_1.default.findOne({ username: uniqueUsername })];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    count++;
                    uniqueUsername = "".concat(req.body.formData.username).concat(count);
                    return [3 /*break*/, 2];
                case 4:
                    req.body.formData.username = uniqueUsername;
                    _a.label = 5;
                case 5:
                    newUser = new user_1.default({
                        username: req.body.formData.username,
                        gameScores: [
                            {
                                gameId: req.body.formData.gameId,
                                score: req.body.formData.time,
                            },
                        ],
                    });
                    if (!!errors.isEmpty()) return [3 /*break*/, 6];
                    res.status(400).json({ errors: errors.array() });
                    return [2 /*return*/];
                case 6: return [4 /*yield*/, newUser.save()];
                case 7:
                    _a.sent();
                    token = createToken(req.body.formData.username);
                    res.status(200).json({ message: 'user created', token: token, username: req.body.formData.username });
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); })
];
exports.addOrUpdateTime = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, played, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, user_1.default.findOne({ username: req.body.formData.username })];
            case 1:
                user = _a.sent();
                if (!(user && req.body.formData.time !== '')) return [3 /*break*/, 3];
                played = user === null || user === void 0 ? void 0 : user.gameScores.findIndex(function (id) { return id.gameId.toString() === req.body.formData.gameId; });
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
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'Completed' });
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json({ message: 'User not found' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).json({ message: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var homeController = require("../controllers/homeController");
var gameController = require("../controllers/gameController");
var leaderboardController = require("../controllers/leaderboardController");
var router = express_1.default.Router();
// home page
router.get('/', homeController.index);
//gamepage 
router.post('/game/startTime', gameController.timeStart);
router.post('/game/endTime', gameController.timeEnd);
router.post('/game/createUser', gameController.createUser);
router.post('/game/addOrUpdateTime', gameController.addOrUpdateTime);
// //scorepage
router.get('/scores', leaderboardController.scores);
exports.default = router;

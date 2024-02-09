import express from 'express';
import * as homeController from '../controllers/homeController'
import * as gameController from '../controllers/gameController'
import * as leaderboardController from '../controllers/leaderboardController'

const router = express.Router();

// home page
router.get('/', homeController.index);

 //gamepage 
router.post('/game/startTime',gameController.timeStart)
router.post('/game/endTime',gameController.timeEnd)
router.post('/game/createUser',gameController.createUser)
router.post('/game/addOrUpdateTime', gameController.addOrUpdateTime) 

// //scorepage
router.get('/scores',leaderboardController.scores);

export default router;
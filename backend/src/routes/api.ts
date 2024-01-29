import express from 'express';
import * as homeController from '../controllers/homeController'
import * as gameController from '../controllers/gameController'
const router = express.Router();

// home page
router.get('/', homeController.index);

// //gamepage '/api/v1/game/startTime'
// router.get('/game/:id',gameController.gameGet);
 router.post('/game/startTime',gameController.timeStart)
 router.post('/game/endTime',gameController.timeEnd)
 router.post('/game/createUser',gameController.createUser)
 router.post('/game/addOrUpdateTime', gameController.addOrUpdateTime) 
// //scorepage
// router.get('v1/scores/:id',gameController.scores);
export default router;
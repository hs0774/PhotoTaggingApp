import 'dotenv/config';
import env from "../util/validateEnv"
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler"
import {body, validationResult} from "express-validator"
import jwt from "jsonwebtoken"
import User from '../models/user';
// import Game from '../models/game';
// import Character from "../models/character";

const createToken = (username: string) => {
    return jwt.sign({username:username},env.SECRET)
}

let clientStartTime:number; 
let clientServerStartDifference:number;
let elapsedTime = 0;

export const timeStart: RequestHandler = async (req,res) => {
    try {
        clientStartTime = Date.now()
        clientServerStartDifference = clientStartTime - req.body.start;
        res.status(200).json ({message:'Started Time'});
    } catch (error) {
        console.error('Could not set up start time', error)
        res.status(500).json({message:`Could not set up start time ${(error as Error).message}`})
    }
};

export const timeEnd: RequestHandler = async (req,res) => {
    try {
        const clientServerEndDifference = Date.now() - req.body.endTime;
        elapsedTime = ((req.body.endTime - clientStartTime) - clientServerStartDifference) - clientServerEndDifference;
        res.status(200).json({ elapsedTime });
    } catch (error) {
        console.error('Could not get finish time', error)
        res.status(500).json({message:`Could not get finish time ${(error as Error).message}`})
    }
};

export const createUser = [
    body('username')
        .trim()
        .isLength({ max: 35 })
        .withMessage('Username cannot exceed 35 characters'),
    body('time')
        .trim(),
    asyncHandler(async (req,res)=> {
        const errors = validationResult(req);
        if (req.body.formData.username === ''){
            req.body.formData.username = 'Anon'
        }
        const existingUser = await User.findOne({ username:req.body.formData.username });
        if (existingUser) {
            let count = 1;
            let uniqueUsername = `${req.body.formData.username}${count}`;
            while (await User.findOne({ username: uniqueUsername })) {
                count++;
                uniqueUsername = `${req.body.formData.username}${count}`;
            }
            req.body.formData.username = uniqueUsername;
        }

        const newUser = new User ({
            username: req.body.formData.username,
            gameScores: [
                {
                gameId:req.body.formData.gameId,
                score:req.body.formData.time,
                },
            ],
        })
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        } else {
            await newUser.save();
            const token = createToken(req.body.formData.username)
            res.status(200).json({message:'user created',token,username:req.body.formData.username})
        }
    })    
];
     
export const addOrUpdateTime: RequestHandler = (async (req,res) => {
    console.log(req.body);
    try {
        const user = await User.findOne({username:req.body.formData.username})
        console.log(user);
        if (user && req.body.formData.time !== '') {
            const played =  user?.gameScores.findIndex(id => id.gameId.toString() === req.body.formData.gameId)

            if(played !== -1) {
                if (req.body.formData.time.localeCompare(user.gameScores[played].score) === -1) {
                    user.gameScores[played].score = req.body.formData.time;
                }
            } else {
                user.gameScores.push({
                    gameId: req.body.formData.gameId,
                    score: req.body.formData.time,
                });
            }
            await user.save();
            res.status(200).json({message:'Completed'})
        } else {
            res.status(404).json({message:'User not found'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//ok so now a cookie is passed to the frontend, it has a username and the cookie, 
//next we update the nav with the users name
// then before every game is finished we check if the cookie is there
// if yes we create another route which i guess will check token, gameid and username,
//also that user skips the submit score modal,



// if that game exists update score else just add the score array 

//we then create an algo for names that were submitted 



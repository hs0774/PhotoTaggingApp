import 'dotenv/config';
import { RequestHandler } from "express";
import User from '../models/user';
import Game from '../models/game';


export const scores: RequestHandler = async (req, res) => {
    try {
    const [games,user] = await Promise.all([
        Game.find().select('_id gameName').exec(),
        User.find().exec(),
    ]) 
    res.status(200).json({ games: games,user });
        
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } 
}
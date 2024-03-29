import { RequestHandler } from "express";
import Game from '../models/game';
import Character from "../models/character";

export const index: RequestHandler = async (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [game,character] = await Promise.all([
            Game.find().populate('characters').exec(),
            Character.find().exec(),
        ]);
        const gamesData = game.map((games) => {

            const imageBuffer = Buffer.from(games.picture.buffer);
            const base64Image = imageBuffer.toString('base64');
            const imageDataURL = `data:image/jpeg;base64,${base64Image}`;

            return {
                _id:games._id,
                gameName:games.gameName,
                picture:imageDataURL,
                characters:games.characters,
            };
        });

        res.status(200).json({ game: gamesData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

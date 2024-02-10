import api from '../src/routes/api'
import request from 'supertest';
import express from "express";
import initializeMongoServer from '../src/mongoConfigTesting';
import mongoose from 'mongoose'

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/',api);

interface IUser{
  _id: string;
  username:string;
  gameScores: Array<{ gameId:mongoose.Types.ObjectId,score:string}>;
}

interface IGame{
  _id: string;
  gameName:string;
  picture:Buffer;
  characters:mongoose.Types.ObjectId[];
}

beforeAll(async () => {
  await initializeMongoServer();
});

// Close MongoDB Memory Server after all tests have finished
afterAll(async () => {
  await mongoose.connection.close()
});

describe('GET /scores', () => {
  it('should return game and user data', async () => {
    const response = await request(app).get('/scores');
    expect(response.status).toBe(200);

    // Check if response body contains games and user arrays
    expect(response.body).toHaveProperty('games');
    expect(response.body).toHaveProperty('user');

    // Check if games array contains expected properties
    expect(Array.isArray(response.body.games)).toBe(true);
    expect(response.body.games.length).toBeGreaterThan(0);
    response.body.games.forEach((game:IGame) => {
      expect(game).toHaveProperty('_id');
      expect(typeof game._id).toBe('string');
      expect(game).toHaveProperty('gameName');
      expect(typeof game.gameName).toBe('string');
    });

    // Check if user array contains expected properties
    expect(Array.isArray(response.body.user)).toBe(true);
    expect(response.body.user.length).toBeGreaterThan(0);
    response.body.user.forEach((user:IUser) => {
      expect(user).toHaveProperty('_id');
      expect(typeof user._id).toBe('string');
      expect(user).toHaveProperty('username');
      expect(typeof user.username).toBe('string');
      expect(user).toHaveProperty('gameScores');
      expect(Array.isArray(user.gameScores)).toBe(true);
    });
  });
});
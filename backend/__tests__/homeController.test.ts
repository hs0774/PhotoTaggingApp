import api from '../src/routes/api'
import request from 'supertest';
import express from "express";
import initializeMongoServer from '../src/mongoConfigTesting';
import mongoose from 'mongoose'

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/',api);

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

describe('GET /', () => {
  it('should return game data', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);

    // Check if response.body.game exists and is an array
    expect(Array.isArray(response.body.game)).toBe(true);

    // Check if the length of the array is 3
    expect(response.body.game.length).toBe(3);

    // Iterate over each game object in the array and perform property checks
    response.body.game.forEach((game:IGame) => {
      expect(game).toHaveProperty('_id');
      expect(typeof game._id).toBe('string');
      expect(game).toHaveProperty('gameName');
      expect(typeof game.gameName).toBe('string');
      expect(game).toHaveProperty('picture');
      expect(typeof game.picture).toBe('string');
      expect(game).toHaveProperty('characters');
      expect(Array.isArray(game.characters)).toBe(true);
    });
  });
});

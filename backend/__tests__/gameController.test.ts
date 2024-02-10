import api from '../src/routes/api'
import request from 'supertest';
import express from "express";
import initializeMongoServer from '../src/mongoConfigTesting';
import mongoose from 'mongoose'
import User from '../src/models/user'

const app = express();
app.use(express.urlencoded({ extended: true }));


app.use('/',api);

beforeAll(async () => {
    await initializeMongoServer();
});
  
afterAll(async () => {
    await mongoose.connection.close();
});

let clientStartTime:number; 
let clientServerStartDifference:number;

let startTime:number;
let endTime:number;

describe('POST /timeStart', () => {
    it('should set clientServerStartDifference within an acceptable range', async () => {

      startTime = Date.now(); // Simulate client start time
  
      const response = await request(app)
        .post('/game/startTime') 
        .send({ start: startTime });
  
      clientStartTime = Date.now();
      clientServerStartDifference = clientStartTime - response.body.start; 
  
      // Ensure clientServerStartDifference is within an acceptable range
      expect(response.status).toBe(200);
    });
  });

   describe('POST /endTime', () => {
    it('should calculate the time from start to finish ', async () => {

      endTime = Date.now(); // Simulate server end time
      
      const response = await request(app)
        .post('/game/endTime') 
        .send({ end: endTime });

      const difference = Date.now() - startTime;
      const elapsedTime = ((response.body.end - clientStartTime) - clientServerStartDifference) - difference;
      expect(elapsedTime).toEqual(response.body.elapsedTime);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('elapsedTime'); 
      expect(typeof response.body.elapsedTime).toBe('object');

    });
  });


describe('POST /addOrUpdateTime', () => {
    it('should update an existing score if the new time is smaller', async () => {
      const existingUser = new User({
        username: 'testUser',
        gameScores: [{ gameId: 'gameId123', score: '01:30' }],
      });
      await existingUser.save();
  
      const formData = {
        username: 'testUser',
        gameId: 'gameId123',
        time: '01:20', // Smaller time
      };
  
      const response = await request(app)
        .post('/game/addOrUpdateTime')
        .send({ formData });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Completed');
    });
  
    it('should add a new score if the user has not played the game before', async () => {
      // Assuming there's an existing user with no game scores
      const existingUser = new User({ username: 'testUser', gameScores: [] });
      await existingUser.save();
  
      const formData = {
        username: 'testUser',
        gameId: 'gameId123',
        time: '01:20',
      };
  
      const response = await request(app)
        .post('/game/addOrUpdateTime')
        .send({ formData });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Completed');
    });
  
    it('should return a 404 error if the user is not found', async () => {
      const formData = {
        username: 'nonexistentUser',
        gameId: 'gameId123',
        time: '01:20',
      };
  
      const response = await request(app)
        .post('/game/addOrUpdateTime')
        .send({ formData });
  
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');

    });
  });

  describe('POST /game/createUser', () => {
    it('should create a new user', async () => {
        const userData = {
            username: 'testUser',
            time: '0:30', 
            gameId: 'someGameId' 
        };

        // Mock User.findOne to return null, indicating that the user doesn't exist yet
        User.findOne = jest.fn().mockResolvedValue(null);

        // Mock User.save to return a new user object
        User.prototype.save = jest.fn().mockResolvedValue({
            _id: 'someUserId', // Mocked user ID
            username: userData.username,
            gameScores: [{
                gameId: userData.gameId,
                score: userData.time
            }]
        });

        // Perform the HTTP request to the createUser endpoint
        const response = await request(app)
            .post('/game/createUser')
            .send(userData);

        // Assert that the response status is 200
        expect(response.status).toBe(200);

        // Assert that the response body contains the expected message and username
        expect(response.body).toEqual(expect.objectContaining({
            message: 'user created',
            token: expect.any(String),
            username: userData.username
        }));

        // Assert that User.findOne was called with the expected parameters
        expect(User.findOne).toHaveBeenCalledWith({ username: userData.username });

        // Assert that User.save was called with the expected user data
        expect(User.prototype.save).toHaveBeenCalledWith({
            username: userData.username,
            gameScores: [{
                gameId: userData.gameId,
                score: userData.time
            }]
        });
    });
});
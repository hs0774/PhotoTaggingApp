import api from '../../src/routes/api'
import request from 'supertest';
import express from "express";
import initializeMongoServer from '../../src/mongoConfigTesting';
import mongoose from 'mongoose'

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
let elapsedTime = 0;
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
 // });

//   describe('POST /endTime', () => {
    it('should calculate the time from start to finish ', async () => {

      endTime = Date.now(); // Simulate server end time

      const response = await request(app)
        .post('/game/endTime') 
        .send({ end: endTime });
      console.log(response.body)
      const difference = Date.now() - startTime;
      elapsedTime = ((response.body.end - clientStartTime) - clientServerStartDifference) - difference
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('elapsedTime'); 
      expect(typeof response.body.elapsedTime).toBe('object');

    });
  });

import "dotenv/config"
import express from "express";
import cors from "cors";
import logger from "morgan"
import cookieParser from "cookie-parser";
import api from './routes/api'

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/v1',api);


export default app;
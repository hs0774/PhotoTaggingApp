import "dotenv/config"
import express from "express";
import cors from "cors";
import logger from "morgan"
import cookieParser from "cookie-parser";
import api from './routes/api'
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";

const app = express();

app.use(cors({
    // origin:"*",
    // origin:"http://localhost:5173",
     origin:"https://photo-tagging-app-128r.vercel.app",
    credentials:true,
}))
app.use(compression());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "script-src": ["'self'"],
      },
    }),
  );
  const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
  });
  // Apply rate limiter to all requests
  app.use(limiter);
  
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/v1',api);


export default app;
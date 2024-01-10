import "dotenv/config"
import express,{Request,Response} from "express";
import cors from "cors";


const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.get("/", (req:Request,res:Response) => {
    res.json("yooo");
});

export default app;
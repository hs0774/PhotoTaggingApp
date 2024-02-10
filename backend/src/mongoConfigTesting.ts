import 'dotenv/config';
import env from './util/validateEnv'
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

async function initializeMongoServer() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = env.MONGODB_URI;

    mongoose.connect(mongoUri);

    mongoose.connection.on("error", e => {
        if (e.message.code === "ETIMEDOUT") {
            console.log(e);
            mongoose.connect(mongoUri);
        }
        console.log(e);
    })

    mongoose.connection.once("open", () => {
        console.log(`MongoDB successfully connected `)
    })
}


export default initializeMongoServer;

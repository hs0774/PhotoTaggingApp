import app from "./app";
import "dotenv/config";
import env from './util/validateEnv'
import mongoose from "mongoose";

const port = env.PORT;
const uri = env.MONGODB_URI; // Asserting that it's a string

mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongoose Connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(console.error);



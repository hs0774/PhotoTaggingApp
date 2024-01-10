import mongoose, { Document,Model,Schema } from "mongoose";

interface IGame extends Document {
    gameName:string;
    picture:Buffer;
    characters:mongoose.Types.ObjectId[];
}
const GameSchema:Schema<IGame> = new Schema({
    gameName:{type:String,required:true},
    picture:{type:Buffer,required: true},
    characters: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Character',
        }
      ]
})

const Game: Model<IGame> = mongoose.model('Game',GameSchema);

export default Game;
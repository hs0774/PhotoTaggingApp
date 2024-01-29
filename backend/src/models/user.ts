import mongoose, { Model, Schema, Document } from 'mongoose'

interface IUser extends Document {
    username:string;
    gameScores: Array<{ gameId:mongoose.Types.ObjectId,score:string}>;
}

const UserSchema:Schema<IUser> = new Schema({
    username:{type:String,required:true},
    gameScores:[
        {
            gameId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Game',
            },
            score:String,
        }
    ],
}) 

const User:Model<IUser> = mongoose.model<IUser>('User',UserSchema);

export default User; 
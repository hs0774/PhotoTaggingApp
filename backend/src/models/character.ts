import mongoose, { Model, Schema, Document } from "mongoose";

interface ICharacter extends Document {
    name: string;
    coords: number[]; // Define coords as an array of numbers
    clicked: boolean;
}

const CharacterSchema:Schema<ICharacter> = new Schema({
    name: { type: String, required: true, maxlength: 35 }, // Use 'maxlength' for name field
    coords: [{ type: Number }], // Define coords as an array of numbers
    clicked: { type: Boolean, default: false },
});

const Character: Model<ICharacter> = mongoose.model<ICharacter>('Character', CharacterSchema);

export default Character;


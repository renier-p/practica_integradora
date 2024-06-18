import mongoose from 'mongoose';

const collectionName = "messages";

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
}, { timestamps: true }); 

const messageModel = mongoose.model(collectionName, messageSchema);

export default messageModel;
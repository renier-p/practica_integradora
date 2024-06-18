import mongoose from "mongoose";

const URI = "mongodb+srv://rainer:2025@cluster0.1fy9xjh.mongodb.net/segunda_integradora?retryWrites=true&w=majority&appName=Cluster0"
const connectToDB = () => {
    try {
            mongoose.connect(URI)
    } catch (error) {
        console.log(error)
    }
}

export default connectToDB
import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async() => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('Invalid or missing enviornment variable: "MONGODB_UR"');
        } 

        await mongoose.connect(process.env.MONGODB_URI, {dbName: "SockMessage"});

    } catch (error) {
        console.log(error);
    }
}
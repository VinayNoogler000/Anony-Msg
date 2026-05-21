import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) { // if Application is already connected to DB, then exit
        console.log("Already Connected to DB");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully");
    } catch (err) {
        console.log("Database Connection failed: ", err);
        process.exit(1);
    }
}

export default dbConnect;
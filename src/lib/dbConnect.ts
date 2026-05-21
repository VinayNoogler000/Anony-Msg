import mongoose from "mongoose";

let connectionStatus: number | undefined;

async function dbConnect(): Promise<void> {
    if (connectionStatus === 1) { // if Application is already connected to DB, then exit
        console.log("Already Connected to DB");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connectionStatus = db.connections[0].readyState;
        console.log("DB Connected Successfully");
    } catch (err) {
        console.log("Database Connection failed: ", err);
        process.exit(1);
    }
}

export default dbConnect;
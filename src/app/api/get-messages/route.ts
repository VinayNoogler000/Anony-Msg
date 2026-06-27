import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const loggedInUser = session?.user;
        
        if (!session || !loggedInUser) {
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(loggedInUser._id);
        
        const userInDB = await UserModel.aggregate([
            { $match: {_id: userId} },
            { $unwind: "$messages" }, // divides the single user doc into multiple docs consisting of same properties, but the 'messages' property will be consisting of a single message doc from the array, instead of the whole array. This aggreation operation is especially used in arrays.
            { $sort: { "messages.createdAt": -1 } }, // sort messages in descending order (latest to oldest),
            { $group: { _id: "$_id", messages: {$push: "$messages" }} } // groups all the divided docs based on no. of messages into a single document consisting of 'user-id' and 'messages' sorted in latest-oldest order
        ]);

        if (!userInDB || userInDB.length === 0) {
            return Response.json({
            success: false,
            message: "User Not Found!"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            messages: userInDB[0].messages
        }, { status: 200 });
    }
    catch(err) {
        return Response.json({
            success: false,
            message: "Error in Fetching Messages. Please try again later."
        }, {status: 500});
    }
}
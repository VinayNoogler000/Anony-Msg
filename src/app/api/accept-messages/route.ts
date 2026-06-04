import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { HydratedDocument } from "mongoose";


export async function POST(req: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const loggedInUser = session?.user as User;
        
        if (!session || !loggedInUser) {
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, { status: 401 });
        }

        const { isAcceptingMsg } = await req.json();

        if (!isAcceptingMsg) {
            return Response.json({
                success: false,
                message: "Missing current status of message acceptance."
            }, { status: 400 });
        }

        const udpatedUser: HydratedDocument<User> | null = await UserModel.findByIdAndUpdate(loggedInUser._id, 
            { isAcceptingMsg }, { returnDocument: "after" } );

        if (!udpatedUser) {
            return Response.json({
                success: false,
                message: "Unable to find the user and udpate message acceptance status"
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            message: "Udpated status of message acceptance successfully!"
        }, { status: 200 });
    }
    catch(err) {
        return Response.json({
            success: false,
            message: "Error in Updating status of message acceptance. Please try again later."
        }, {status: 500});
    }
}
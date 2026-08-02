import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface msgIdPathParam {
    params: { messageId: string }
}

export async function DELETE(req: Request, {params}:msgIdPathParam) {
    const messageId = params.messageId;
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
        
        const updatedUser = await UserModel.updateOne( { _id: loggedInUser?._id }, { $pull: { messages: { _id: messageId } } });

        if (updatedUser.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deletd!"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message Deleted!"
        }, { status: 200 });
    }
    catch(err) {
        console.error("An Unexpected Error Occurred when Deleting Message: ", err);

        return Response.json({
            success: false,
            message: `Error in Deleting Message (${messageId}). Please try again later.`
        }, {status: 500});
    }
}
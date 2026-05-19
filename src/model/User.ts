import mongoose, {Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verificationCode: string,
    verificationCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMsg: boolean,
    messages: Message[]
}

const UserSchema:Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        trim: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        trim: true,
        minLength: [8, "Minimum Length should be 8 characters"]
    },
    verificationCode: {
        type: String,
        required: [true, "Verification code is required!"],
        minLength: [6, "Verification code should be of 6 characters"],
        maxLength: [6, "Verification code should be of 6 characters"],
    },
    verificationCodeExpiry: {
        type: Date,
        required: [true, "Veryfication code expiry is required!"],        
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;
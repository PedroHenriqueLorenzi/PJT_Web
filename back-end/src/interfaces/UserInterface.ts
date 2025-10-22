import {ObjectId} from "mongodb";

export interface UserInterface {
    _id?: string | ObjectId;
    name: string;
    username: string;
    email: string;
    passwordH: string;
    age?: number;
    notification: boolean;
    avatar_url?: string;
    token_expires_at: Date;
    createdAt: Date;
    updatedAt: Date;
}

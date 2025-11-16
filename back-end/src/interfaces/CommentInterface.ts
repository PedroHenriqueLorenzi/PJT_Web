import {ObjectId} from "mongodb";

export interface CommentInterface {
    _id?: string | ObjectId;
    postId: string | ObjectId;
    userId: string | ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

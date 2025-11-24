import { ObjectId } from "mongodb";

export interface NotificationInterface {
    _id?: ObjectId | string;
    userId: ObjectId | string;
    type: "join_request";
    requesterId?: ObjectId | string;
    communityId?: ObjectId | string;
    message: string;
    read: boolean;
    createdAt: Date;
}
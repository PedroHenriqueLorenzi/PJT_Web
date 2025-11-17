import { ObjectId } from "mongodb";

export interface FollowInterface {
    _id?: string | ObjectId;
    followerId: string | ObjectId;
    followingId: string | ObjectId;
    createdAt: Date;
}

import {ObjectId} from "mongodb";

export interface PostInterface {
    _id?: string | ObjectId;
    communityId: string | ObjectId;
    userId: string | ObjectId;
    title: string;
    img_url?: string | null;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

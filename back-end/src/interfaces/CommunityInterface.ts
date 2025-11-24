import {ObjectId} from "mongodb";

export interface CommunityInterface {
    _id?: string | ObjectId;
    ownerId: string | ObjectId;
    name: string;
    description: string;
    type: string;
    created_by: string | ObjectId;
    img_url: string;
    createdAt: Date;
    updatedAt: Date;
}

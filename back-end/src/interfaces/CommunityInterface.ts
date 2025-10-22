import {ObjectId} from "mongodb";

export interface CommunityInterface {
    _id?: string | ObjectId;
    name: string;
    description: string;
    type: string;
    created_by: string | ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

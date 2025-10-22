import {ObjectId} from "mongodb";

export interface TagInterface {
    _id?: string | ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

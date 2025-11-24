// src/interfaces/CommunityMemberInterface.ts
import {ObjectId} from "mongodb";

export type CommunityRole = 'member' | 'moderator' | 'admin' | 'pending';

export interface CommunityMemberInterface {
    _id?: string | ObjectId;
    communityId: string | ObjectId;
    userId: string | ObjectId;
    role: CommunityRole;
    joinedAt: Date;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

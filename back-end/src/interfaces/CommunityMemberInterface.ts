// src/interfaces/CommunityMemberInterface.ts
import {ObjectId} from "mongodb";

export type CommunityRole = 'member' | 'moderator' | 'admin';

export interface CommunityMemberInterface {
    _id?: string | ObjectId;
    communityId: string;
    userId: string;
    role: CommunityRole;
    joinedAt: Date;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

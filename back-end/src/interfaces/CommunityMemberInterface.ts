// src/interfaces/CommunityMemberInterface.ts
export type CommunityRole = 'member' | 'moderator' | 'admin';

export interface CommunityMemberInterface {
    _id?: string;
    communityId: string;
    userId: string;
    role: CommunityRole;
    joinedAt: Date;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

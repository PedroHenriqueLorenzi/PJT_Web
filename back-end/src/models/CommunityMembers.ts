// src/models/CommunityMemberModel.ts
import { Db, ObjectId } from 'mongodb';
import { CommunityMemberInterface } from '../interfaces/CommunityMemberInterface';

export class CommunityMember {
    constructor(private db: Db) {}

    private collection() {
        return this.db.collection<CommunityMemberInterface>('community_members');
    }

    async create(data: CommunityMemberInterface): Promise<CommunityMemberInterface> {
        const now = new Date();
        const memberData = { ...data, createdAt: now, updatedAt: now };
        const result = await this.collection().insertOne(memberData);
        return { _id: result.insertedId.toString(), ...memberData };
    }

    // Remove membro;
    async removeMember(id: string): Promise<void> {
        await this.collection().deleteOne({ _id: new ObjectId(id) });
    }

    // Lista todas as comunidades de um usuário;
    async findByUser(userId: string): Promise<CommunityMemberInterface[]> {
        return this.collection()
            .find({ userId })
            .toArray();
    }
}

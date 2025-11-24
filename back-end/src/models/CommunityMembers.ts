// src/models/CommunityMemberModel.ts
import { Db, ObjectId } from 'mongodb';
import { CommunityMemberInterface } from '../interfaces/CommunityMemberInterface';

export class CommunityMember {
    constructor(private db: Db) {}

    private collection() {
        return this.db.collection<CommunityMemberInterface>('community_members');
    }

    // Adiciona um novo membro à comunidade;
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

    // Encontra um membro específico em uma comunidade;
    async findMembership(userId: string, communityId: string): Promise<CommunityMemberInterface | null> {
        return this.collection().findOne({
            userId: userId,
            communityId: communityId,
        });
    }

    async delete(userId: string, communityId: string): Promise<void> {
        await this.collection().deleteOne({
            userId: userId,
            communityId: communityId
        });
    }

    async updateMembership(
        userId: string,
        communityId: string,
        updates: Partial<CommunityMemberInterface>
    ) {
        return this.collection().updateOne(
            {
                userId: new ObjectId(userId),
                communityId: new ObjectId(communityId)
            },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );
    }
}

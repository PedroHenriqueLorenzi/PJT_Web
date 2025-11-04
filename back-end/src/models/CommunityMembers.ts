// src/models/CommunityMemberModel.ts
import { Db } from 'mongodb';
import { CommunityMemberInterface } from '../interfaces/CommunityMemberInterface';

export class CommunityMember {
    constructor(private db: Db) {}

    // Retorna a collection
    collection() {
        return this.db.collection<CommunityMemberInterface>('community_members');
    }

    // Adicionar membro à comunidade
    async addMember(
        data: Omit<CommunityMemberInterface, '_id' | 'createdAt' | 'updatedAt'>
    ): Promise<CommunityMemberInterface> {
        const now = new Date();
        const memberData = { ...data, createdAt: now, updatedAt: now };
        const result = await this.collection().insertOne(memberData);
        return { _id: result.insertedId.toString(), ...memberData };
    }

    // Atualizar dados do membro (role, active, etc)
    async updateMember(
        id: string,
        data: Partial<CommunityMemberInterface>
    ): Promise<void> {
        data.updatedAt = new Date();
        await this.collection().updateOne({ _id: id }, { $set: data });
    }

    // Remover membro (opcionalmente apenas desativar)
    async removeMember(id: string): Promise<void> {
        await this.collection().deleteOne({ _id: id });
    }

    // Listar todos os membros de uma comunidade
    async findByCommunity(communityId: string): Promise<CommunityMemberInterface[]> {
        return this.collection()
            .find({ communityId })
            .toArray();
    }

    // Listar todas as comunidades de um usuário
    async findByUser(userId: string): Promise<CommunityMemberInterface[]> {
        return this.collection()
            .find({ userId, active: true })
            .toArray();
    }

    // Buscar um membro específico
    async findMember(
        communityId: string,
        userId: string
    ): Promise<CommunityMemberInterface | null> {
        return this.collection().findOne({ communityId, userId });
    }
}

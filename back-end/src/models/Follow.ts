// src/models/Follow.ts
import { Db, ObjectId } from "mongodb";
import { FollowInterface } from "../interfaces/FollowInterface";

export class Follow {
    constructor(private db: Db) {}

    collection() {
        return this.db.collection<FollowInterface>("follows");
    }

    // Seguir um usuário
    async follow(followerId: string | ObjectId | undefined, followingId: string): Promise<void> {
        await this.collection().insertOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId),
            createdAt: new Date()
        });
    }

    // Deixar de seguir
    async unfollow(followerId: string | ObjectId | undefined, followingId: string): Promise<void> {
        await this.collection().deleteOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId)
        });
    }

    // Verifica se já está seguindo
    async isFollowing(followerId: string | ObjectId | undefined, followingId: string): Promise<boolean> {
        const doc = await this.collection().findOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId)
        });

        return !!doc;
    }

    // Lista pessoas que o usuário segue
    async getFollowing(userId: string): Promise<FollowInterface[]> {
        return this.collection()
            .find({ followerId: new ObjectId(userId) })
            .toArray();
    }

    // Lista seguidores de um usuário
    async getFollowers(userId: string): Promise<FollowInterface[]> {
        return this.collection()
            .find({ followingId: new ObjectId(userId) })
            .toArray();
    }

    // Contar quantos o usuário segue
    async countFollowing(userId: string): Promise<number> {
        return this.collection().countDocuments({
            followerId: new ObjectId(userId)
        });
    }

    // Contar seguidores
    async countFollowers(userId: string): Promise<number> {
        return this.collection().countDocuments({
            followingId: new ObjectId(userId)
        });
    }
}

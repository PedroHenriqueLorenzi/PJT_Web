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
}

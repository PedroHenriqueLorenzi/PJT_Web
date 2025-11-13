// src/models/UserModel.ts
import { Db, ObjectId } from 'mongodb';
import { PostInterface } from '../interfaces/PostInterface';

export class Post {
    constructor(private db: Db) {}

    collection() {
        return this.db.collection<PostInterface>('posts');
    }

    async create(postData: PostInterface): Promise<PostInterface> {
        const result = await this.collection().insertOne(postData);
        return { _id: result.insertedId, ...postData };
    }

    async findById(postId: string): Promise<PostInterface | null> {
        return this.collection().findOne({ _id: new ObjectId(postId) });
    }

    async findByCommunityId(communityId: string): Promise<PostInterface[]> {
        return this.collection()
            .find({communityId: communityId})
            .toArray();
    }

    async findByCommunities(communityIds: string[]): Promise<PostInterface[]> {
        return this.collection()
            .find({communityId: { $in: communityIds }})
            .toArray();
    }
}

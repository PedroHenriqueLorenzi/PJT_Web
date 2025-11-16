// src/models/CommentModel.ts
import { Db, ObjectId } from 'mongodb';
import { CommentInterface } from '../interfaces/CommentInterface';

export class Comment {
    constructor(private db: Db) {}

    collection() {
        return this.db.collection<CommentInterface>('comments');
    }

    async create(data: CommentInterface) {
        const now = new Date();
        const commentData = { ...data, createdAt: now, updatedAt: now };
        const result = await this.collection().insertOne(commentData);
        return { _id: result.insertedId.toString(), ...commentData };
    }

    async findByPost(postId: string) {
        return this.collection()
            .find({ postId: postId })
            .sort({ createdAt: -1 })
            .toArray();
    }
}

// src/models/CommunityModel.ts
import { Db, ObjectId } from 'mongodb';
import { CommunityInterface } from '../interfaces/CommunityInterface';

export class Community {
    constructor(private db: Db) {}

    collection() {
        return this.db.collection<CommunityInterface>('communities');
    }

    async findAll(): Promise<Omit<CommunityInterface, '_id'>[]> {
        return this.collection()
            .find({}, {
                projection: {
                    name: 1,
                    description: 1,
                    type: 1,
                    created_by: 1,
                    img_url: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            })
            .toArray();
    }

    async findById(id: string): Promise<CommunityInterface | null> {
        return this.collection().findOne({ _id: new ObjectId(id) });
    }

    async findByName(name: string): Promise<CommunityInterface | null> {
        return this.collection().findOne({ name });
    }

    async create(data: CommunityInterface): Promise<CommunityInterface> {
        const now = new Date();
        const communityData = { ...data, createdAt: now, updatedAt: now };
        const result = await this.collection().insertOne(communityData);
        return { _id: result.insertedId.toString(), ...communityData };
    }

    async update(id: string, data: Partial<CommunityInterface>): Promise<void> {
        data.updatedAt = new Date();
        await this.collection().updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
    }

    async delete(id: string): Promise<void> {
        await this.collection().deleteOne({ _id: new ObjectId(id) });
    }
}

// src/models/UserModel.ts
import { Db, ObjectId } from 'mongodb';
import { UserInterface } from '../interfaces/UserInterface';

export class User {
    constructor(private db: Db) {}

    collection() {
        return this.db.collection<UserInterface>('users');
    }

    async findAll(): Promise<Omit<UserInterface, 'passwordH' | 'notification' | '_id'>[]> {
        return this.collection()
            .find({}, {
                projection: {
                    name: 1,
                    username: 1,
                    email: 1,
                    age: 1,
                    avatar_url: 1
                }
            })
            .toArray();
    }

    async findByEmail(email: string): Promise<UserInterface | null> {
        return this.collection().findOne({ email });
    }

    async findById(id: string): Promise<UserInterface | null> {
        return this.collection().findOne({ _id: new ObjectId(id) });
    }

    async findByIds(userIds: string[]) {
        return this.collection()
            .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
            .toArray();
    }

    async create(user: UserInterface): Promise<UserInterface> {
        const result = await this.collection().insertOne(user);
        return { _id: result.insertedId.toString(), ...user };
    }

    async update(id: string, data: Partial<UserInterface>): Promise<void> {
        await this.collection().updateOne({ _id: new ObjectId(id) }, { $set: data });
    }
}

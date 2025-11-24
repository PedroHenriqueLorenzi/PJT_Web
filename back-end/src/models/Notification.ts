import { Db, ObjectId } from "mongodb";
import { NotificationInterface } from "../interfaces/NotificationInterface";

export class Notification {
    private col;

    constructor(db: Db) {
        this.col = db.collection<NotificationInterface>("notifications");
    }

    async create(data: Omit<NotificationInterface, "_id" | "createdAt" | "read">) {
        return this.col.insertOne({
            ...data,
            read: false,
            createdAt: new Date(),
        });
    }

    async findByUser(userId: string) {
        return this.col
            .find({
                userId: new ObjectId(userId),
                read: false
            })
            .sort({ createdAt: -1 })
            .toArray();
    }

    async findById(id: string) {
        return this.col.findOne({ _id: new ObjectId(id) });
    }

    async markAsRead(id: string) {
        return this.col.updateOne(
            { _id: new ObjectId(id) },
            { $set: { read: true } }
        );
    }
}

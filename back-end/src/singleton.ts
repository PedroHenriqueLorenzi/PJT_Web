// src/config/mongo.singleton.ts
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

class MongoSingleton {
    private static client: MongoClient;
    private static db: Db;

    private constructor() {}

    static async getInstance(): Promise<Db> {
        if (!MongoSingleton.db) {
            console.debug('Initializing Mongo singleton...');

            const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD!)}@cluster0.flw2g8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

            MongoSingleton.client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });

            await MongoSingleton.client.connect();
            MongoSingleton.db = MongoSingleton.client.db(process.env.DB_NAME);
        }

        return MongoSingleton.db;
    }
}

export default MongoSingleton;

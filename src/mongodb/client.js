const MongoClient = require('mongodb').MongoClient;

const defaultConfig = {
    dbName: 'MyDb',
};
class MondoClient {
    constructor(config) {
        const { 
            dbName 
        } = Object.assign({}, defaultConfig, config);

        this.dbName = dbName;
        this.dataBase = null;
    }

    init(callback) {
        MongoClient.connect("mongodb://localhost:27017", (err, database) => {
            if(err) {
                throw err;
            }
            this.dataBase = database.db(this.dbName);
            callback(this.dataBase);
        });
    }
    getCollection(collectionName) {
        return this.dataBase
            .collection(collectionName)
            .find()
            .toArray();
    }
    add(collectionName, objectOrArray) {
        this.dataBase.collection(collectionName, (err, coll) => {

            if (Array.isArray(objectOrArray)) {
                coll.insertMany(objectOrArray);
                return;
            }
            
            coll.insertOne(objectOrArray);
        });
    }
}

module.exports = MondoClient;
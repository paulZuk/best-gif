const MongoClient = require('mongodb').MongoClient;

const connectDB = (callback) => {
    MongoClient.connect("mongodb://localhost:27017/MyDb", (err, database) => {
        const dataBase = database.db('MyDb');
        callback(dataBase);
    });
}

const add = (collectionName, objectArray) => {
    connectDB((db) => {
        db.collection(collectionName, (err, coll) => {

            if (Array.isArray(objectArray)) {
                objectArray.forEach(elem => coll.insert(elem));
                return;
            }
            
            coll.insert(objectArray);
        });
    })
 
}

const getCollection = collectionName => {
    connectDB((db) => {
        db.collection(collectionName, function (err, collection) {
        
            collection.find().toArray(function(err, items) {
               if(err) throw err;    
               console.log(items);            
           });
           
       });
    });
}

module.exports = {
    add,
    getCollection,
};
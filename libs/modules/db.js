const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const db = (requestType, notebookId, notebookJSON) => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, options, (err, client) => {
      return new Promise((resolve, reject) => {
        console.log("Connected to MongoDB");
        if (err) {
          console.error(err);
          return;
        }
        const database = client.db("redpoint");
        const collection = database.collection("notebooks");

        if (requestType === "LOAD") {
          loadNotebook(collection, notebookId).then(loadedNotebook => {
            resolve(loadedNotebook);
          });
        } else if (requestType === "SAVE") {
          saveNotebook(collection, notebookId, notebookJSON).then(
            saveResponse => {
              resolve(saveResponse);
            }
          );
        } else if (requestType === "UPDATE") {
          collection.updateOne(
            { id: notebookId },
            { $set: { notebookJSON } },
            (err, item) => {
              console.log(`Updated Item: ${item}`);
              client.close();
              return item.insertedId;
            }
          );
        }
      }).then(queryResult => {
        client.close();
        // console.log("Query Result: ", queryResult);
        console.log("Connection to MongoDB closed");
        resolve(queryResult);
      });
    });
  });
};

module.exports = db;

const loadNotebook = (collection, notebookId) => {
  return new Promise((resolve, reject) => {
    collection
      .findOne({ id: notebookId })
      .then(loadedNotebook => {
        resolve(loadedNotebook);
      })
      .catch(err => {
        console.error(err);
      });
  });
};

const saveNotebook = (collection, notebookId, notebookJSON) => {
  return new Promise((resolve, reject) => {
    const saveStatus = collection.updateOne(
      { id: notebookId },
      { $set: notebookJSON },
      { upsert: true }, // updates if exists, else inserts new entry
      (err, result) => {
        console.log(`mongoID of insertOne: ${result}`);
      }
    );
    resolve(saveStatus);
  });
};
// this should be in a db.js file:
// const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } = process.env;
// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
// const options = {
// 	useNewUrlParser: true,
// 	reconnectTries: Number.MAX_VALUE,
// 	reconnectInterval: 500,
// 	connectTimeoutMS: 10000
// };

// mongoose.connect(url, options).then( function() {
//   console.log('MongoDB is connected');
// })
//   .catch( function(err) {
//   console.log(err);
// });
//

// const connect = mongo.connect(url, options, (err, client) => {
//   console.log("Connected to MongoDB");
//   if (err) {
//     console.error(err);
//     return;
//   }
//   const database = client.db("redpoint");
//   const collection = database.collection("notebooks");

//   return([collection, client])
// });

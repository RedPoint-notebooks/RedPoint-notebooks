const mongo = require("mongodb").MongoClient;
// use this url instead if no authentication enabled on database
// const url = "mongodb://localhost:27017";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// pull mongo credentials from .env file
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const db = (requestType, notebook, notebookId) => {
  return new Promise(resolve => {
    const before = Date.now();

    mongo.connect(url, options, (err, client) => {
      return new Promise(resolve => {
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
          saveNotebook(collection, notebook).then(saveResponse => {
            resolve(saveResponse);
          });
        }
      }).then(queryResult => {
        const after = Date.now();
        const requestDuration = after - before;
        console.log(`DB Query took: ${requestDuration} ms`);
        client.close();
        console.log("Closed connection to MongoDB");
        resolve(queryResult);
      });
    });
  });
};

module.exports = db;

const loadNotebook = (collection, notebookId) => {
  return new Promise(resolve => {
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

const saveNotebook = (collection, notebook) => {
  return new Promise(resolve => {
    const saveStatus = collection.updateOne(
      { id: notebook.id },
      { $set: notebook },
      { upsert: true }, // updates if exists, else inserts new entry
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Mongo result of insertOne: ${result}`);
        }
      }
    );
    resolve(saveStatus);
  });
};

const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// const db = {
// load: loadRequest(notebookId => handleRequest("LOAD", notebookId)),
// update: updateRequest((notebookId, payload) => {
//   handleRequest("UPDATE", notebookId, payload);
// }),
// save: saveRequest((notebookId, payload) => {
//   handleRequest("SAVE", notebookId, payload);
// })
const db = (requestType, notebookId, notebookJSON) => {
  console.log("in handle DB request");

  const queryResult = mongo.connect(url, options, (err, client) => {
    console.log("Connected to MongoDB");
    if (err) {
      console.error(err);
      return;
    }
    const database = client.db("redpoint");
    const collection = database.collection("notebooks");

    if (requestType === "LOAD") {
      collection
        .findOne({ id: notebookId })
        .then(item => {
          console.log("=> Retrieved Notebook: ", item);
          return item;
        })
        .catch(err => {
          console.error(err);
        });
    } else if (requestType === "SAVE") {
      collection.insertOne(notebookJSON, (err, result) => {
        console.log(`mongoID of insertOne: ${result}`);
      });
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

    // collection.find().toArray((err, items) => {
    // 	console.log(items);
    // });

    client.close();
    console.log("Query Result: ", queryResult);
    console.log("Connection to MongoDB closed");
    return queryResult;
  });
};

module.exports = db;
// module.exports = db;

// const handleRequest = (requestType, notebookId, notebookJSON) => {
//   console.log("in handle DB request");

//   const queryResult = mongo.connect(url, options, (err, client) => {
//     console.log("Connected to MongoDB");
//     if (err) {
//       console.error(err);
//       return;
//     }
//     const database = client.db("redpoint");
//     const collection = database.collection("notebooks");

//     if (requestType === "LOAD") {
//       collection
//         .findOne({ id: notebookId })
//         // .findOne({ name: 'Charles!!' })
//         .then(item => {
//           console.log(item);
//           client.close();
//           return item;
//         })
//         .catch(err => {
//           console.error(err);
//         });
//     } else if (requestType === "SAVE") {
//       collection.insertOne(notebookJSON, (err, result) => {
//         console.log(`mongoID of insertOne: ${result.insertedId}`);
//         client.close();
//       });
//     } else if (requestType === "UPDATE") {
//       collection.updateOne(
//         { id: notebookId },
//         { $set: { notebookJSON } },
//         (err, item) => {
//           console.log(`Updated Item: ${item}`);
//           client.close();
//           return item.insertedId;
//         }
//       );
//     }

//     // collection.find().toArray((err, items) => {
//     // 	console.log(items);
//     // });

//     client.close();
//     console.log("Connection to MongoDB closed");
//     return queryResult;
//   });
// };

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

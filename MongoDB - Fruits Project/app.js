const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace the placeholder with your Atlas connection string
const uri = "mongodb://127.0.0.1:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}
);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const database = client.db("fruitsDB");
    const fruits = database.collection("fruits");
    // create a document to insert
    // const doc = [
    //   {
    //     name: "Apple",
    //     score: 8,
    //     review: "Great fruit."
    //   },
    //   {
    //     name: "Orange",
    //     score: 10,
    //     review: "Kinda sour."
    //   },
    //   {
    //     name: "Banana",
    //     score: 9,
    //     review: "Great stuff!"
    //   },
    // ]
    // const result = await fruits.insertMany(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);


    // query for movies that have a runtime less than 15 minutes
    // const query = { runtime: { $lt: 15 } };
    // const options = {
    //   // sort returned documents in ascending order by title (A->Z)
    //   sort: { title: 1 },
    //   // Include only the `title` and `imdb` fields in each returned document
    //   projection: { _id: 0, title: 1, imdb: 1 },
    // };
    const cursor = fruits.find({} , {});

    // print a message if no documents were found
    if ((await fruits.countDocuments()) === 0) {
      console.log("No documents found!");
    }
    // replace console.dir with your callback to access individual elements
    await cursor.forEach(console.dir);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


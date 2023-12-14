const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//mongodb config
const { MongoClient, ServerApiVersion, ObjectID } = require("mongodb");
const uri =
  "mongodb+srv://aayushj2001:QAYCn1OHCsLdP0R0@cluster0.zey151s.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a collection of the documents
    const bookCollection = client.db("BookInventory").collection("books");

    //insert book to the database using post method
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await bookCollection.insertOne(data);
      res.send(result);
    });

    //get all books from database
    app.get("/all-books", async (req, res) => {
      const books = bookCollection.find();
      const result = await books.toArray();
      res.send(result);
    });

    //update all books : path or update method
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectID(id) };
      const updateDoc = {
        $set: {
          ...updateBookData,
        },
      };
      const options = { upsert: true };
      //update
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //delete a book data
    app.delete("/book/:id", async (req, res) => {
      const {id} = req.params;
      const filter = { _id: new ObjectID(id) };
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

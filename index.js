const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONO_NAME}:${process.env.MONO_KEY}@cluster0.wrggdnr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const touristsCollection = client
      .db("World_Journeys")
      .collection("tourists");
    const usersCollection = client.db("World_Journeys").collection("users");
    // show all tourists spots
    app.get("/tourists", async (req, res) => {
      const result = await touristsCollection.find().toArray();
      res.send(result);
    });
    // get tourist details card datas
    app.post("/tourist", async (req, res) => {
      const details = req.body;
      const result = await touristsCollection.insertOne(details);
      res.send(result);
    });
    // get one tourist details form database
    app.get("/tourist/:id", async (req, res) => {
      const id = req.params.id;
      const tourist = req.body;
      const filter = { _id: new ObjectId(id) };
      const result = await touristsCollection.findOne(filter);
      res.send(result);
    });
    // get user details who is entering
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    //

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

app.get("/", (req, res) => {
  res.send("THe World Journey Server Is running now!");
});
app.listen(port, () => {
  console.log(`The World Journes Server Port running now ${port}`);
});

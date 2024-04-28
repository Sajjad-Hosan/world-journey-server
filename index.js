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
    const countryCollection = client
      .db("World_Journeys")
      .collection("countryName");
    const userSpotCollection = client
      .db("World_Journeys")
      .collection("userSpots");
    const tourGuidesCollection = client
      .db("World_Journeys")
      .collection("guideDetails");
    // show all tourists spots
    app.get("/tourists", async (req, res) => {
      const result = await touristsCollection.find().toArray();
      res.send(result);
    });
    // show all country details
    app.get("/countrys", async (req, res) => {
      const result = await countryCollection.find().toArray();
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
    // update tourist save data from database
    app.put("/tourist/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      console.log(update);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateData = {
        $set: {
          image: update.photoUrl,
          tourists_spot_name: update.spotName,
          country_name: update.countryName,
          location: update.locationName,
          short_description: update.shortDes,
          description: update.description,
          average_cost: update.avgCost,
          seasonality: update.seasonality,
          travel_time: update.travelTime,
          totalVisitorsPerYear: update.totalVisitor,
        },
      };
      const result = await touristsCollection.updateOne(
        filter,
        updateData,
        option
      );
      res.send(result);
    });
    // get user details who is entering
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // get user add spot data from database
    app.get("/user-spots", async (req, res) => {
      const result = await userSpotCollection.find().toArray();
      res.send(result);
    });
    // get user add data from database findone method
    app.get("/user-spot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userSpotCollection.findOne(filter);
      res.send(result);
    });
    //post or create or save tuor data from client user
    app.post("/user-spot", async (req, res) => {
      const tourDetails = req.body;
      const result = await userSpotCollection.insertOne(tourDetails);
      res.send(result);
    });
    // update user add spot from database
    app.put(`/user-spot/:id`, async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateData = {
        $set: {
          tourists_spot_name: update.spotName,
          country_Name: update.countryName,
          location: update.locationName,
          short_description: update.shortDes,
          description: update.description,
          average_cost: update.avgCost,
          travel_time: update.travelTime,
          image: update.photoUrl,
          seasonality: update.seasonality,
          totalVisitorsPerYear: update.totalVisitor,
          userName: update.userName,
          userEmail: update.userEmail,
        },
      };
      const result = await userSpotCollection.updateOne(
        filter,
        updateData,
        option
      );
      res.send(result);
    });
    // delete user add data from database
    app.delete(`/user-spot/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userSpotCollection.deleteOne(filter);
      res.send(result);
    });
    // get tour guides data
    app.get("/guides", async (req, res) => {
      const result = await tourGuidesCollection.find().toArray();
      res.send(result);
    });
  } finally {
    // nothing is here
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("THe World Journeys Webpage Server Is running now!");
});
app.listen(port, () => {
  console.log(`The World Journeys Server Port running now ${port}`);
});

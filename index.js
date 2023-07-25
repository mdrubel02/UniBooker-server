const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000


// midleware
app.use(cors())
app.use(express.json())

//Cluster01
//unibooker
//RRx3XzDKj51B0vF4
const uri = "mongodb+srv://unibooker:RRx3XzDKj51B0vF4@cluster01.eubkpu8.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const collegeCollection = client.db("UniBooker").collection("college")
    const usersCollection = client.db("UniBooker").collection("user")
    const univercityBookingCollection = client.db("UniBooker").collection("univercity-booking")
    const reviwCollection = client.db("UniBooker").collection("reviw")

    app.get('/college', async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result)
    })
    app.get('/collegeDetails/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await collegeCollection.findOne(query);
      res.send(result);
    })
    //user create
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.post('/choice', async (req, res) => {
      const booking = req.body
      const result = await univercityBookingCollection.insertOne(booking)
      res.send(result)
    })
    app.get('/choice', async (req, res) => {
      const result = await univercityBookingCollection.find().toArray()
      res.send(result)
    })
    app.post('/reviws', async (req, res) => {
      const reviw = req.body;
      const result = await reviwCollection.insertOne(reviw)
      res.send(result);
    })
    app.get('/reviws', async (req, res) => {
      const result = await reviwCollection.find().toArray()
      res.send(result);
    })
    app.get('/search/:name', async (req, res) => {
      const name = req.params.name;
      const query = { college_name: { $regex: new RegExp(name, 'i') } };
      const results = await collegeCollection.find(query).toArray();
      res.send(results)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(error => console.error(error.message))

app.get('/', (req, res) => {
  res.send('hello UniBooker')
})

app.listen(port, () => {
  console.log(`UniBooker is running on ${port}`)
})
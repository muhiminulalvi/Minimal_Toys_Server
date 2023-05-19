const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASSWORD);


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kkbgyge.mongodb.net/?retryWrites=true&w=majority`;

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

    // const toyCollection = client.db('minimalToys').collection('toys');
  
    // app.get('/toys/:text', async(req, res) => {
      
        
    // })

    // add toy
    const addToyCollection = client.db('minimalToys').collection('addToy')
    app.post('/addtoy', async(req,res) => {
        const body = req.body
        const result = await addToyCollection.insertOne(body)
        console.log(result);
        res.send(result)
    })
    // get toy to all toy page
    app.get('/toys', async(req, res)=> {
      const result = await addToyCollection.find({}).toArray()
      res.send(result)
    })

    // click on view details page to show clicked data
    app.get('/toys/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}

      const options = {
        projection: {_id:1, toy_name: 1, image: 1, seller_name: 1, email: 1, quantity: 1, price: 1, category: 1, ratings: 1, description: 1}
      }
      const result = await addToyCollection.findOne(query, options)
      res.send(result)
    })


    // my toys
    app.get('/mytoys', async(req, res) => {
      console.log(req.query.email);
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await addToyCollection.find(query).toArray()
      res.send(result)
    })

    // update
    app.put('/mytoys/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const toyUpdate = req.body;
      const updateDoc = {
        $set: {
          description: toyUpdate.description,
          price: toyUpdate.price,
          quantity: toyUpdate.quantity,
          toy_name: toyUpdate.toy_name,
          image: toyUpdate.image,
          category: toyUpdate.category
        },
      };
      console.log(toyUpdate);
      const result = await addToyCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // delete
    app.delete('/mytoys/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addToyCollection.deleteOne(query)
      res.send(result)
    })

    // get toy by filtering

    app.get('/categoryToys/:text', async(req, res) => {
      console.log(req.params.text);
      if(req.params.text == "racing" || req.params.text == "regular" || req.params.text == "trucks"){
        const cursor = addToyCollection.find({category: req.params.text})
        const result = await cursor.toArray()
        return res.send(result)
      }
      const cursor = addToyCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      // const result = await addToyCollection.find({}).toArray()
      // res.send(result)
    })

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
  res.send("Minimal Toy is Running");
});

app.listen(port, () => {
  console.log(`Minimal Toy in running on port ${port}`);
});

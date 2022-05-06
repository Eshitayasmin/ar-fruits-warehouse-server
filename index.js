const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).send({ message: 'Forbidden access'});
//     }
//     console.log('decoded', decoded);
//     req.decoded = decoded;
//     next();
//   })

// }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lkcwk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const inventoryCollection = client.db('arWarehouse').collection('inventory');
      const myCollection = client.db('arWarehouse').collection('myItem');
     
  
      //get inventory
      app.get('/inventory', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
      })
  
      app.get('/inventory/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const item = await inventoryCollection.findOne(query);
        res.send(item);
      })
  
      //Add item (POST)
      app.post('/inventory', async (req, res) => {
        const newItem = req.body;
        const result = await inventoryCollection.insertOne(newItem);
        res.send(result);
      })
  
      //Delete Item
      app.delete('/inventory/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await inventoryCollection.deleteOne(query);
        res.send(result);
      })

      //My Item collection api
      // app.get('/myitem', async (req, res) => {
      //   const decodedEmail = req.decoded.email;
      //   const email = req.query.email;
      //   if (email === decodedEmail) {
      //     const query = { email: email };
      //     const cursor = myCollection.find(query);
      //     const myItems = await cursor.toArray();
      //     res.send(myItems);
      //   } 
      //   else{
      //     res.status(403).send({ message: 'Forbidden access'});
      //   }
      // })
  
      // app.post('/my', async (req, res) => {
      //   const newItem = req.body;
      //   const result = await myCollection.insertOne(newItem);
      //   res.send(result);
      // })
  
    }
    finally {
  
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('AR Wareouse');
})

app.listen(port, () =>{
    console.log('ar warehouse is running', port);
})
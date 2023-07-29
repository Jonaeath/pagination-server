const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@cluster0.pg0dj0q.mongodb.net/?retryWrites=true&w=majority`;
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
    const productCollection = client.db('dhakaShoping').collection('products');

    app.get('/products', async(req, res) =>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page,size)
      const query = {}
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({count,products});
    });

    app.post('/productsByIds', async(req,res)=>{
      const ids = req.body;
      const newids = ids?.map(id => new ObjectId(id))
      const query = {_id: {$in: newids}};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("Dhaka Shop server is running");
})

app.listen(port, ()=>{
    console.log(`Dhaka Shop server running on ${port}`)
});
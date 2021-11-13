const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // because we will transfer data as json and will receive as well

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhb9e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// ***********************main function start from here **************************
async function run() {
    try{
     await client.connect();
    //  console.log("database connected successfully");
    const database = client.db('wellnessShop');
    const productsCollection = database.collection('products');
    // const reviewCollection = database.collection('reviews');
    const allOrders = database.collection('allOrders');
     
     

    // // get review data from the database
    //    app.get('/reviews', async(req,res)=>{
    //     const cursor = reviewCollection.find({});
    //     const reviews = await cursor.toArray();
    //     res.send(reviews);
    // });
  

    // // Post Api for review collection
    // app.post('/reviews', async(req,res)=>{
    //     const review = req.body;
    //     console.log("hit the post API",review);
    //     const result = await reviewCollection.insertOne(product);
    //     console.log(result);
    //     res.json(result);
    // });

    //     get from database
    app.get('/products', async(req,res)=>{
        const cursor = productsCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    });


    //  POST API
    app.post('/orders', async(req,res)=>{
        const product = req.body;
        // console.log('hit the post api',service);
        const query = {product}; // n
        const result = await allOrders.insertOne(query); //n
        // const result = await servicesCollection.insertOne(service);  // uncomment
        console.log(result);
        res.json(result);
    });
     //Find all order
     app.get('/order', async(req,res)=>{
        const query = {};
        const cursor = allOrders.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

    // GET SINGLE SERVICE
    app.get('/products/:id', async(req,res)=>{
        const id = req.params.id;
        console.log('getting service', id);
        const query = {_id: ObjectId(id)};
        const product = await productsCollection.findOne(query);
        res.json(product);
    })

    // Delete Operation
    app.delete('/order/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id)};
        const result = await allOrders.deleteOne(query);
        res.json(result);
    });




    // 1st post data (POST API)
    app.post('/products', async(req,res)=>{
        const product = req.body;
        console.log("hit the post API",product);
        const result = await productsCollection.insertOne(product);
        console.log(result);
        res.json(result);
    });
    }
    finally{
    // await client.close();
    }
}
run().catch(console.dir);




// *********************** main function end here *********************************
app.get('/', (req,res) =>{
    res.send("Hello wellness shop, welcome and run in server.")
});
app.listen(port, ()=>{
    console.log(`listen at ${port}`);
});
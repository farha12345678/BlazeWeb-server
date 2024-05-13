const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnkwiqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const blogCollection = client.db("elevenDB").collection('blog');
        const wishCollection = client.db("elevenDB").collection('wishlist');
        const commentCollection = client.db("elevenDB").collection('comment');

        // blog
        app.get('/blog', async (req, res) => {
            const cursor = blogCollection.find()
            const result = await cursor.toArray();

            res.send(result)
        })
        // addBlog
        app.post('/blog', async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog);
            const result = await blogCollection.insertOne(newBlog)
            res.send(result)
        })
        app.get('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogCollection.findOne(query)
            res.send(result)
        })
        // update
        app.put('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateBlog = req.body;
            const update = {
                $set: {
                    title: updateBlog.title,
                    image: updateBlog.image,
                    short_description: updateBlog.short_description,
                    long_description: updateBlog.long_description,
                    category: updateBlog.category

                },
            };
            const result = await blogCollection.updateOne(query, update, options);
            res.send(result)
        })

        app.get('/blog', async(req,res)=> {
            const search = req.query.search

            let query = {
                blog_title : {$regex : search, $options: "i"}
            }
            
            const result = blogCollection.find(query).toArray()
            res.send(result)
        })

        // comment
        app.get('/comment', async (req, res) => {
            const cursor = commentCollection.find()
            const result = await cursor.toArray();

            res.send(result)
        })
        app.post('/comment', async (req, res) => {
            const newComment = req.body;
            console.log(newComment);
            const result = await commentCollection.insertOne(newComment)
            res.send(result)
        })
        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await commentCollection.findOne(query)
            res.send(result)
        })

        // WishList
        app.get('/wish', async (req, res) => {
            const cursor = wishCollection.find()
            const result = await cursor.toArray();

            res.send(result)
        })

        app.post('/wish', async(req,res)=> {
            
            const wish = req.body;
            console.log(wish);
            const result = await wishCollection.insertOne(wish)
            res.send(result)
        })
        // app.get('/wish/:_id', async (req, res) => {
        //     const wishId = req.params._id;
        //     const query = { wishId: new ObjectId(wishId) }
        //     const result = await wishCollection.findOne(query)
        //     res.send(result)
        // })

        app.get('/wish/:email', async(req,res)=> {
            console.log(req.params.email);
            const result =await wishCollection.find({email:req.params.email}).toArray()
           
            res.send(result)
            
        })
        // server.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;

// const app = express();
// const port = 3000;

// Middleware
// app.use(bodyParser.json());

// MongoDB connection URL
// const url = 'mongodb://localhost:27017';
// const dbName = 'yourDatabaseName';

// API endpoint for job search
// app.post('/searchBlogs', async (req, res) => {
//     try {
        // Connect to MongoDB
        // const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        // const db = client.db(dbName);
        
        // Search term from client-side
        // const searchTerm = req.body.searchTerm;
        
        // Construct regex pattern
        // const regexPattern = new RegExp(searchTerm, "i");

        // MongoDB query
        // const query = { title: { $regex: regexPattern } };
        
        // Execute the query
        // const matchedBlogs = await blogCollection.find(query).toArray();
        
        // Close the connection
        // client.close();

        // Send the matched jobs back to the client
//         res.json({ blogs: matchedBlogs });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });






        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDB connection string
const uri = `mongodb+srv://simpleCrudUser:5Ls0NckDqEsZNBWO@cluster0.v57rrxh.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {

        // Connect the client to the server
        await client.connect();

        const db = client.db('simpleCRUD');
        const usersCollections = db.collection('users');

        app.get('/users', async (req, res) => {
            const cursor = usersCollections.find({});
            const result = await cursor.toArray();
            res.send(result)
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }

            const user = await usersCollections.findOne(query);
            // console.log(id, 'userId');
            res.send(user)
        })

        await client.db('admin').command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Simple CRUD server is running');
});

app.listen(port, () => {
    console.log(`CRUD server is running on port ${port}`);
})


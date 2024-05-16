const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:5173', 'https://group-study-8d6a9.firebaseapp.com', 'https://group-study-8d6a9.web.app'],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.begblt8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const assignmentCollection = client.db("assignment_collection").collection("assignments");

        app.get('/all-assignments', async (req, res) => {
            const result = await assignmentCollection.find().toArray();
            res.send(result);
        })

        app.get('/all-assignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query)
            res.send(result)

        })

        app.get('/all-assignments/email/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await assignmentCollection.findOne(filter)
            res.send(result)

        })

        app.post('/all-assignments', async (req, res) => {
            const newAssignment = req.body;
            const result = await assignmentCollection.insertOne(newAssignment);
            res.send(result);
        })

        app.delete('/all-assignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query);
            res.send(result);
        })


        app.put('/all-assignments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateAssignment = req.body;

            const assignment = {
                $set: {
                    title: updateAssignment.title,
                    description: updateAssignment.description,
                    marks: updateAssignment.marks,
                    difficulty: updateAssignment.difficulty,
                    updateDate: updateAssignment.updateDate,
                    photo: updateAssignment.photo,
                }
            }
            const result = await assignmentCollection.updateOne(filter, assignment)
            res.send(result);
        })

        // submitted assignment
        const submittedAssignmentCollection = client.db("assignment_collection").collection("submitted_assignments");

        app.get('/all-submitted-assignments', async (req, res) => {
            const newSubmittedAssignment = req.body;
            const result = await submittedAssignmentCollection.find(newSubmittedAssignment).toArray();
            res.send(result);
        })

        app.get('/all-submitted-assignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await submittedAssignmentCollection.findOne(query);
            res.send(result);
        })

        app.post('/all-submitted-assignments', async (req, res) => {
            const newSubmittedAssignment = req.body;
            const result = await submittedAssignmentCollection.insertOne(newSubmittedAssignment);
            res.send(result);
        })


        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Student Connection Portal is running')
})


app.listen(port, () => {
    console.log(`Portal is running on port: ${port}`);
})
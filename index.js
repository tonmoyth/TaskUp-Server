const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kqyf4iv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const taskCollection = client.db("taskCollection").collection("tasks");

    // insert task
    app.post("/tasks", async (req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks);
      res.send(result);
    });

    // find six tasks
    app.get("/tasks", async (req, res) => {
      const result = await taskCollection
        .find({})
        .sort({ date: 1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // find add tasks
    app.get('/all_Tasks', async (req,res) => {
        const result = await taskCollection.find().toArray();
        res.send(result);
    })

    // get single task
    app.get('/all_Tasks/:id', async (req,res) => {
        const {id} = req.params;
        const filter = {_id : new ObjectId(id)};
        const result = await taskCollection.findOne(filter);
        res.send(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

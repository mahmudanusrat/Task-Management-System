require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5175"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u87o4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const tasksCollection = client.db("taskManagerDb").collection("tasks");
    const usersCollection = client.db("taskManagerDb").collection("users");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res.cookie("token", token, cookieOptions).send({ success: true });
    });

    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", { ...cookieOptions, maxAge: 0 })
        .send({ success: true });
    });

    app.post("/users", async (req, res) => {
      const { uid, email, displayName } = req.body;
      const isExist = await usersCollection.findOne({ uid });
      if (isExist) {
        return res.send(isExist);
      }
      const newUser = await usersCollection.insertOne({
        uid,
        email,
        displayName,
      });
      res.send(newUser);
    });

    app.post("/tasks", async (req, res) => {
      const { title, description, category } = req.body;
      if (
        !title ||
        title.length > 50 ||
        !category ||
        !["To-Do", "In Progress", "Done"].includes(category)
      ) {
        return res.status(400).send({ message: "Invalid task data" });
      }

      try {
        const newTask = await tasksCollection.insertOne({
          title,
          description,
          category,
        });
        res
          .status(201)
          .send({ message: "Task created successfully", task: newTask });
      } catch (error) {
        res.status(500).send({ message: "Error creating task", error });
      }
    });
    app.get("/tasks", verifyToken, async (req, res) => {
      try {
        const tasks = await tasksCollection.find().toArray();
        res.status(200).send(tasks);
      } catch (error) {
        res.status(500).send({ message: "Error fetching tasks", error });
      }
    });
    
    app.put("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const { title, description, category } = req.body;

      if (
        !title ||
        title.length > 50 ||
        !category ||
        !["To-Do", "In Progress", "Done"].includes(category)
      ) {
        return res.status(400).send({ message: "Invalid task data" });
      }

      try {
        const updatedTask = await tasksCollection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { title, description, category } },
          { returnDocument: "after" }
        );
        if (!updatedTask.value) {
          return res.status(404).send({ message: "Task not found" });
        }
        res
          .status(200)
          .send({
            message: "Task updated successfully",
            task: updatedTask.value,
          });
      } catch (error) {
        res.status(500).send({ message: "Error updating task", error });
      }
    });
    app.delete("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const deletedTask = await tasksCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (!deletedTask.deletedCount) {
          return res.status(404).send({ message: "Task not found" });
        }
        res.status(200).send({ message: "Task deleted successfully" });
      } catch (error) {
        res.status(500).send({ message: "Error deleting task", error });
      }
    });
    app.put("/tasks/reorder", async (req, res) => {
      const { taskIds } = req.body; // List of task IDs in the new order

      try {
        const bulkOperations = taskIds.map((taskId, index) => ({
          updateOne: {
            filter: { _id: new ObjectId(taskId) },
            update: { $set: { order: index } }, // Assuming you are using an 'order' field for sorting tasks
          },
        }));

        await tasksCollection.bulkWrite(bulkOperations);
        res.status(200).send({ message: "Tasks reordered successfully" });
      } catch (error) {
        res.status(500).send({ message: "Error reordering tasks", error });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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
  res.send("Task management system server is running");
});

app.listen(port, () => {
  console.log(`Task management system server is running on port ${port}`);
});

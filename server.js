require("dotenv").config();
// const PORT = process.env.PORT || 8000
const { PORT = 8000, DATABASE_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

/////////////////////////

mongoose.connect(DATABASE_URL)

mongoose.connection
.on("open", () => console.log("Mongo connected"))
.on("close", () => console.log("Mongo disconnected"))
.on("error", () => console.log(error))

/////////////////////////

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

/////////////////////////

const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", peopleSchema)

/////////////////////////
app.get("/", (req, res) => {
    res.json({hello: "world"})
})

/////////////////////////

// INDUCES => IDUCS: INDEX DESTROY UPDATE CREATE SHOW

// INDEX - GET - /people - gets all people
app.get("/people", async (req, res) => {
    try {
      // fetch all people from database
      const people = await People.find({});
      // send json of all people
      res.json(people);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
});

// CREATE - POST - /people - create a new person
app.post("/people", async (req, res) => {
    try {
        // create the new person
        const person = await People.create(req.body)
        // send newly created person as JSON
        res.json(person)
    }
    catch(error){
        res.status(400).json({ error })
    }
});

// SHOW - GET - /people/:id - get a single person
app.get("/people/:id", async (req, res) => {
    try {
      // get a person from the database
      const person = await People.findById(req.params.id);
      // return the person as json
      res.json(person);
    } catch (error) {
      res.status(400).json({ error });
    }
});

// UPDATE - PUT - /people/:id - update a single person
app.put("/people/:id", async (req, res) => {
    try {
      // update the person
      const person = await People.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      // send the updated person as json
      res.json(person);
    } catch (error) {
      res.status(400).json({ error });
    }
});

// DESTROY - DELETE - /people/:id - delete a single person
app.delete("/people/:id", async (req, res) => {
    try {
        // delete the person
        const person = await People.findByIdAndDelete(req.params.id)
        // send deleted person as json
        res.status(204).json(person)
    } catch(error){
        res.status(400).json({error})
    }
})

/////////////////////////

app.listen(PORT, () => console.log(`listening on ${PORT}`))
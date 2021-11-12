const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());


const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        const database = client.db("luxury_car");
        const sliderData = database.collection("slider_data");
        const products_collection = database.collection("products_collection");
        const orders_collection = database.collection("orders_collection");

        // get slider data
        app.get("/slider_data", async (req, res) => {
            const result = await sliderData.find({}).toArray();
            res.json(result);
        });

        // get products data
        app.get("/products_data", async (req, res) => {
            const result = await products_collection.find({}).toArray();
            res.json(result);
        });

        // get a specific product data
        app.get("/:product_id", async (req, res) => {
            const id = req.params.product_id;
            const result = await products_collection.findOne({ _id: ObjectId(id) });
            res.json(result);
        });
    
    // add to orders_collection
    app.post("/add_to_product", async (req, res) => {
        const data = req.body;
        const result = await orders_collection.insertOne(data);
        res.json(result);
    });
    }

    finally {

    }


}

run().catch(console.dir());

app.get("/", (req, res) => {
    res.send("Running Luxury Car");
});

app.listen(port, () => {
    console.log("Running project at", port);
})
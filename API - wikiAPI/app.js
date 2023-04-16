const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static("public"));


main().then(async () => {
    await getRoutes();
})
.catch(err => console.log(err));


async function main() {
    await mongoose.connect(process.env.DB_STR).catch(err => console.log(err));
}

const getRoutes = async () => {
    const Article = await createArticleSchema();
}

const createArticleSchema = async () => {
    const articleSchema = await new mongoose.Schema({
        title: {
            type: String,
            default: "No title"
        },
        content: {
            type: String,
            required: true
        }
    });
    const articleModel = await new mongoose.model("Article" , articleSchema);
    return {
        schema: articleSchema,
        model: articleModel
    }
}

app.listen(3000 , () => {
    console.log("Succesfully connected to server on port 3000.");
});
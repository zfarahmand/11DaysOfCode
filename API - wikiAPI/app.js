const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engie" , "ejs");
app.use(express.static("public"));


main().then(async () => {
    console.log("db connected");
})
.catch(err => console.log(err));


async function main() {
    await mongoose.connect(process.env.DB_STR).catch(err => console.log(err));
}

app.listen(3000 , () => {
    console.log("Succesfully connected to server on port 3000.");
});
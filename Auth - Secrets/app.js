const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

main().then(async () => {
    await getRoutes();
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_STR).catch(err => console.log(err));
}

async function getRoutes() {
    const User = await createUserSchema();

    app.get("/" , (req , res) => {
        res.render("home");
    });

    app.get("/login" , (req , res) => {
        res.render("login");
    });

    app.get("/register" , (req , res) => {
        res.render("register");
    });

    app.post("/register" , async (req , res) => {

    });
}

const createUserSchema = async () => {
    const userSchema = await new mongoose.Schema({
        email : {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

    const userModel = await new mongoose.model("User" , userSchema);

    return {
        schema: userSchema,
        model: userModel
    }
}

app.listen(process.env.SERVER_PORT , () => {
    console.log("Server succesfully started on port 3000");
})

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

main().then(async () => {
    await getRoutes();
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_STR).catch(err => console.log(err));
}

const getRoutes = async () => {
    const User = await createUserSchema();

    app.get("/", (req, res) => {
        res.render("home");
    });

    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.post("/login" , async (req, res) => {
        await loginUser(User.model , req.body.username , req.body.password , res);
    });

    app.get("/register", (req, res) => {
        res.render("register");
    });

    app.post("/register", async (req, res) => {
        await registerUser(User.model, req.body.username, req.body.password, res);
    });
}

const createUserSchema = async () => {
    const userSchema = await new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

    const userModel = await new mongoose.model("User", userSchema);

    return await {
        schema: userSchema,
        model: userModel
    }
}

const registerUser = async (userModel, userEmail, userPassword, res) => {
    const newUser = await new userModel({
        email: userEmail,
        password: userPassword
    });

    return await newUser.save().then(() => {
        res.render("secrets");
    }).catch(err => console.log(err));
}

const loginUser = async (userModel, userEmail, userPassword, res) => {
    const foundUser = await userModel.findOne({ email: userEmail }).exec().then((foundUser) => {
        if (foundUser) {
            if (foundUser.password === userPassword) {
                res.render("secrets");
            }
        }
    }).catch(err => console.log(err));
}

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server succesfully started on port 3000");
})

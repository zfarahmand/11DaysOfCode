const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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

    app.post("/login", async (req, res) => {
        await loginUser(User.model, req.body.username, req.body.password, req, res);
    });

    app.get("/register", (req, res) => {
        res.render("register");
    });

    app.post("/register", async (req, res) => {
        await registerUser(User.model, req.body.username, req.body.password, req, res);
    });

    app.get("/secrets", (req, res) => {
        if (req.isAuthenticated()) {
            res.render("secrets");
        }
        else {
            res.redirect("/login");
        }
    });

    app.get("/logout" , async (req , res) => {
        await logOutUser(req , res);
    });
}

const createUserSchema = async () => {
    const userSchema = await new mongoose.Schema({
        email: String,
        password: String
    });
    // userSchema.plugin(encrypt , { encryptionKey: process.env.ENC_KEY, signingKey: process.env.SIG_KEY ,encryptedFields: ['password'] });
    userSchema.plugin(passportLocalMongoose);

    const userModel = await new mongoose.model("User", userSchema);

    passport.use(userModel.createStrategy());
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());

    return await {
        schema: userSchema,
        model: userModel
    }
}

const registerUser = async (userModel, userEmail, userPassword, req, res) => {
    userModel.register({ username: userEmail, active: true }, userPassword, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
            // passport.authenticate("local" , (err , user , info) => {
            //     if(err) {
            //         console.log(err);
            //     }
            //     else {
            //         // if(!user) {
            //         //     console.log("username or password incorrect");
            //         // }
            //         response.redirect("/secrets");
            //     }
            // })(request , response);


        }
    });


    // await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS)).then((salt) => {
    //     bcrypt.hash(userPassword, salt).then(async (hash) => {
    //         const newUser = await new userModel({
    //             email: userEmail,
    //             password: hash
    //         });
    //         return await newUser.save().then(() => {
    //             res.render("secrets");
    //         }).catch(err => console.log(err));


    //     }).catch(err => console.log(err));
    // }).catch(err => console.log(err));
}

const loginUser = async (userModel, userEmail, userPassword, req, res) => {
    const user = new userModel({
        username: userEmail,
        password: userPassword
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local", (err, _user, info) => {
                if (err) {
                    console.log(err);
                }
                else {
                    if (!_user) {
                        console.log("username or password incorrect");
                    }
                    else {
                        res.redirect("/secrets");
                    }
                }
            })(req, res);
        }
    });

    // const foundUser = await userModel.findOne({ email: userEmail }).exec().then(async (foundUser) => {
    //     if (foundUser) {
    //         if (await bcrypt.compare(userPassword, foundUser.password)) {
    //             res.render("secrets");
    //         }
    //     }
    // }).catch(err => console.log(err));
}

const logOutUser = (req , res) => {
    req.logout((err) => {
        if(err) { 
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });
}


app.listen(process.env.SERVER_PORT, () => {
    console.log("Server succesfully started on port 3000");
})

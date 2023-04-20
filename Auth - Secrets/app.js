require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
// const encrypt = require("mongoose-encryption");
// const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

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
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
}


const createUserSchema = async () => {
    const userSchema = new mongoose.Schema({
        email: String,
        password: String,
        googleId: String,
        secret: String
    });

    // userSchema.plugin(encrypt , { encryptionKey: process.env.ENC_KEY, signingKey: process.env.SIG_KEY ,encryptedFields: ['password'] });
    userSchema.plugin(passportLocalMongoose);
    userSchema.plugin(findOrCreate);

    const User = new mongoose.model("User", userSchema);

    passport.use(User.createStrategy());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).exec().then((user) => {
            done(null, user);
        }).catch(err => console.log(err));
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
        function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));

    return {
        model: User,
        schema: userSchema
    }
}


const getRoutes = async () => {
    const User = (await createUserSchema()).model;

    app.get("/", function (req, res) {
        res.render("home");
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get("/register", function (req, res) {
        res.render("register");
    });

    app.post("/register", async function (req, res) {
        await registerUser(User, req, res);
    });

    app.post("/login", async function (req, res) {
        await loginUser(User, req, res);
    });

    app.get("/auth/google", passport.authenticate('google', { scope: ["profile"] }));

    app.get("/auth/google/secrets", passport.authenticate('google', { failureRedirect: "/login" }), (req, res) => {
        // Successful authentication, redirect to secrets.
        res.redirect("/secrets");
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    app.get("/secrets", function (req, res) {
        User.find({"secret": {$ne: null}}).then((foundUsers) => {
            if(foundUsers) {
                res.render("secrets" , {
                    usersWithSecrets: foundUsers
                });
            }
        }).catch(err => console.log(err));
    });

    app.get("/submit" , (req , res) => {
        if (req.isAuthenticated()) {
            res.render("submit");
        }
        else {
            res.redirect("/login");
        }
    });

    app.post("/submit" , async (req , res) => {
        if (req.isAuthenticated()) {
            // console.log(req.user.id);
            await createSecret(User ,  req.body.secret , req , res);
        }
        else {
            res.redirect("/login");
        }
    });
}

const registerUser = (User, req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
}


const loginUser = (User, req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
}


const createSecret = async (User , secret , req , res) => {
    if (req.isAuthenticated()) {
        const foundUser = await User.findById(req.user.id).exec().then((foundUser) => {
            if(!foundUser) {
                console.log("No user with given credentials.");
            }
            else {
                foundUser.secret = secret;
                foundUser.save().then(() => {
                    res.redirect("/secrets");
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    }
    else {
        res.redirect("/login");
    }
}


app.listen(process.env.SERVER_PORT, () => {
    console.log("Server succesfully started on port 3000");
});







// const registerUser = async (userModel, userEmail, userPassword, req, res) => {
//     userModel.register({ username: userEmail, active: true }, userPassword, (err, user) => {
//         if (err) {
//             console.log(err);
//             res.redirect("/register");
//         }
//         else {
//             passport.authenticate("local")(req, res, () => {
//                 res.redirect("/secrets");
//             });
//             // passport.authenticate("local" , (err , user , info) => {
//             //     if(err) {
//             //         console.log(err);
//             //     }
//             //     else {
//             //         // if(!user) {
//             //         //     console.log("username or password incorrect");
//             //         // }
//             //         response.redirect("/secrets");
//             //     }
//             // })(request , response);


//         }
//     });


//     // await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS)).then((salt) => {
//     //     bcrypt.hash(userPassword, salt).then(async (hash) => {
//     //         const newUser = await new userModel({
//     //             email: userEmail,
//     //             password: hash
//     //         });
//     //         return await newUser.save().then(() => {
//     //             res.render("secrets");
//     //         }).catch(err => console.log(err));


//     //     }).catch(err => console.log(err));
//     // }).catch(err => console.log(err));
// }

// const loginUser = async (userModel, userEmail, userPassword, req, res) => {
//     const user = new userModel({
//         username: userEmail,
//         password: userPassword
//     });

//     req.login(user, (err) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             passport.authenticate("local", (err, _user, info) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     if (!_user) {
//                         console.log("username or password incorrect");
//                     }
//                     else {
//                         res.redirect("/secrets");
//                     }
//                 }
//             })(req, res);
//         }
//     });

//     // const foundUser = await userModel.findOne({ email: userEmail }).exec().then(async (foundUser) => {
//     //     if (foundUser) {
//     //         if (await bcrypt.compare(userPassword, foundUser.password)) {
//     //             res.render("secrets");
//     //         }
//     //     }
//     // }).catch(err => console.log(err));
// }

// const logOutUser = (req , res) => {
//     req.logout((err) => {
//         if(err) { 
//             console.log(err);
//         }
//         else {
//             res.redirect("/");
//         }
//     });
// }
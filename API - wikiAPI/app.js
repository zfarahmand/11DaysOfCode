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

    app.route("/articles")
    .get(async (req , res) => {
        await getArticles(Article.model , res);
    })
    .post(async (req , res) => {
        await createArticle(Article.model , req.body.title , req.body.content , res);
    })
    .delete(async (req , res) => {
        await deleteArticles(Article.model , res);
    });
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

const getArticles = async (articleModel , res) => {
    await articleModel.find().exec()
    .then((articles) => {
        res.send(articles);
    }).catch((err) => {
        res.send(err);
    });
}

const createArticle = async (articleModel , articleTitle , articleContent , res) => {
    const newArticle = new articleModel({
        title: articleTitle,
        content: articleContent
    });
    return await newArticle.save().then(() => {
        res.send("Succesfully added the article.");
    }).catch((err) => {
        res.send(err);
    });
}

const deleteArticles = async (articleModel , res) => {
    return await articleModel.deleteMany().then(() => {
        res.send("Succesfully deleted all the articles")
        .catch((err) => {
            res.send(err);
        });
    })
}

app.listen(3000 , () => {
    console.log("Succesfully connected to server on port 3000.");
});
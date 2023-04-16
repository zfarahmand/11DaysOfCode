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

    app.route("/articles/:title")
    .get(async (req , res) => {
        await getArticle(Article.model , req.params.title , res);
    })
    .put(async (req , res) => {
        await overwriteArticle(Article.model , req.params.title , req.body.title , req.body.content , res);
    })
    .patch(async (req , res) => {
        await updateArticle(Article.model , req.params.title , req.body , res);
    })
    .delete(async (req, res) => {
        await deleteArticle(Article.model , req.params.title , res);
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

const getArticle = async (articleModel , articleTitle , res) => {
    await articleModel.findOne({title: articleTitle}).exec()
    .then((article) => {
        res.send(article);
    })
    .catch((err) => {
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

const overwriteArticle = async (articleModel , articleTitle , newArticleTitle , newArticleContent , res) => {
    return await articleModel.findOneAndUpdate({title: articleTitle} , 
         {title: newArticleTitle , content: newArticleContent}, {overwrite: true})
    .then(() => {
        res.send("Succesfully updated the article.");
    })
    .catch((err) => {
        res.send(err);
    });
}

const updateArticle = async (articleModel , articleTitle , newArticle , res) => {
    return await articleModel.findOneAndUpdate({title: articleTitle} , newArticle)
    .then(() => {
        res.send("Succesfully updated the article.");
    })
    .catch((err) => {
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

const deleteArticle = async (articleModel , articleTitle , res) => {
    return await articleModel.findOneAndDelete({title: articleTitle})
    .then(() => {
        res.send("Succesfully deleted the article.");
    })
    .catch((err) => {
        res.send(err);
    });
}

app.listen(3000 , () => {
    console.log("Succesfully connected to server on port 3000.");
});
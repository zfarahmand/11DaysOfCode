const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _string = require('lodash/string');
const { default: mongoose } = require("mongoose");
const { stubString } = require("lodash");
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().then(async () => {
  await getRoutes();
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_STR).catch(err => console.log(err));
}


const getRoutes = async() => {
  const Post  = await createPostSchema();
  const posts = await getPosts(Post.model);

  app.get("/" , (req , res) => {  
    res.render("home" , {
      homeStartingContent: process.env.HOME_START_CONTENT,
      posts: posts
    } );
  });
  
  
  app.get("/about" , (req , res) => {
    res.render("about" , {
      aboutContent: process.env.ABOUT_CONTENT
    } );
  });
  
  
  app.get("/contact" , (req , res) => {
    res.render("contact" , {
      contactContent: process.env.CONTACT_CONTENT
    } );
  });
  
  
  app.get("/compose" , (req , res) => {
    res.render("compose");
  });
  
  app.post("/compose" , async (req, res) => {
    await createPost(Post.model , req.body.title , req.body.post);  
    res.redirect("/");
  });
  
  app.get("/posts/:title" , async (req , res) => {
    const foundPost = await getPost(Post.model , req.params.title);
    console.log(foundPost);

    if(!Object.is(foundPost , null)) {
      res.render("post" , {
        post: foundPost
      })
    }
    else {
      res.send("404");
    }
  });
}

const getPost = async (postModel , postURL) => {
  return await postModel.findOne({url: _string.lowerCase(postURL)}).exec();
}

const getPosts = async (postModel) => {
  return await postModel.find({}).exec();
}

const createPostSchema = async () => {
  postSchema = await new mongoose.Schema({
    title: {
      type: String,
      default: "No title"
    },
    body: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  });
  const Post = await new mongoose.model("Post" , postSchema);
  return {
    schema: postSchema,
    model: Post
  }
}

const createPost = async (postModel , title , body) => {
  const newPost = new postModel({
    title: title,
    body: body,
    url: _string.lowerCase(title)
  });
  await newPost.save().catch(err => console.log(err));
}

const deletePost = async () => {}


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

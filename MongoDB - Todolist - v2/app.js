const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
    .then(() => {
        console.log("Succesfully connected to mongo server.");
    })
    .catch(err => console.log(err));
    
    const Item = await createItemSchema();
    const items = await getItems(Item);

    await app.get("/" , (req , res) => {
        const farsiDate = date.getDate();
        const farsiDateFormatted = farsiDate.dayName + "," + farsiDate.day + " ام " + farsiDate.month;
    
        res.render("index" , {
            listTitle: farsiDateFormatted,
            newItems: items,
            redirect: "/"
        });
    });

    // await console.log(getItems(Item));

    // const item1 = new Item({
    //     name: "دیدن 10 قسمت از دوره Tailwind",
    //     done: false
    // });
    // const item2 = new Item({
    //     name: "خواندن 10 صفحه کتاب",
    //     done: false
    // });
    // const item3 = new Item({
    //     name: "نوشتن",
    //     done: false
    // });

    // await Item.insertMany([item1 , item2 , item3])
    // .then(() => {
    //     console.log("Succesfully added items to the document.");
    // })
    // .catch(err => console.log(err));

    await mongoose.connection.close();
}

function createItemSchema() {
    const itemSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true , "The name has to be specified."]
        },
        done: Boolean
    });
    return new mongoose.model("Item" , itemSchema);
}

function getItems(Item , query = {}) {
    return Item.find(query);
}

// function createNewItems(model , newItems = )






app.post("/" , (req , res) => {
    newItems.push(req.body.newItem);
    res.redirect("/");
});

app.get("/work" , (req, res) => {
    res.render("index" , { listTitle: "لیست کاری" , newItems: workItems , redirect: "/work" });
});

app.post("/work" , (req, res) => {
    workItems.push(req.body.newItem);
    res.redirect("/work");
});

app.get("/about" , (req , res) => {
    res.render("about" , {});
});

app.listen(3000 , () => {
    console.log("Server started on port 3000.");
})
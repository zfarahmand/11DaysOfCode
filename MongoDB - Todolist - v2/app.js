const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

main().then(async() => {
    await getRoutes();
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB").catch(err => console.log(err));
}

const createItemSchema = () => {
    const itemSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "The name has to be specified."]
        },
        done: Boolean
    });
    return new mongoose.model("Item", itemSchema);
}

const createNewItems = async (model, newItem) => {
    return await newItem.save().then(() => {
        return true;
    }).catch((err) => {
        console.log(err);
        return false;
    });
}

const deleteItem = async(model , id) => {
    return await model.findByIdAndDelete(id)
    .then(()=>{
        console.log("Succesfully deleted the item.");
    })
    .catch(err => console.log(err));
}

const getRoutes = async() => {
    const Item = await createItemSchema();
    const items = await Item.find({done:false}).select('name').exec();

    // app.get("/work", (req, res) => {
    //     res.render("index", { listTitle: "لیست کاری", newItems: workItems, redirect: "/work" });
    // });
    
    app.get("/" , (req , res) => {
        const farsiDate = date.getDate();
        const farsiDateFormatted = farsiDate.dayName + "," + farsiDate.day + " ام " + farsiDate.month;
    
        res.render("index", {
            listTitle: farsiDateFormatted,
            newItems: items,
            redirect: "/"
        });
    });

    app.post("/" , (req , res) => {
        createNewItems(Item , new Item({
            name: req.body.newItem,
            done: false
        }))
        res.redirect(301 ,"/" );
    });

    app.post("/delete" , (req , res) => {
        const itemID =  req.body.delete;
        deleteItem(Item , itemID);

        res.redirect(301 , "/");
    });

    app.post("/work", (req, res) => {
        workItems.push(req.body.newItem);
        res.redirect("/work");
    });
    
    app.get("/about", (req, res) => {
        res.render("about", {});
    });
}

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
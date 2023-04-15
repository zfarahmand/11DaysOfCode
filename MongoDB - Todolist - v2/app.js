const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

main().then(async () => {
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
    Item = new mongoose.model("Item", itemSchema);
    return {
        schema: itemSchema,
        model: Item
    };
}

const createListSchema = () => {
    const listSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        items: [Item.schema]
    });
    const List = new mongoose.model("List", listSchema);
    return {
        schema: listSchema,
        model: List
    };
}

const createNewDocuments = async (newDocument) => {
    await newDocument.save().then(() => {
        return true;
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

const deleteItem = async (model, id) => {
    return await model.findByIdAndDelete(id)
        .then(() => {
            console.log("Succesfully deleted the item.");
        })
        .catch(err => console.log(err));
}

const getRoutes = async () => {
    const Item = await createItemSchema();
    const items = await Item.model.find({ done: false }).select('name').exec();

    const List = await createListSchema();


    app.get("/", (req, res) => {
        const farsiDate = date.getDate();
        const farsiDateFormatted = farsiDate.dayName + "," + farsiDate.day + " ام " + farsiDate.month;

        res.render("index", {
            listTitle: farsiDateFormatted,
            newItems: items,
            redirect: "/"
        });
    });

    app.post("/", (req, res) => {
        createNewDocuments(new Item.model({
            name: req.body.newItem,
            done: false
        }))
        res.redirect(301, "/");
    });

    app.post("/delete", (req, res) => {
        const itemID = req.body.delete;
        deleteItem(Item.model, itemID);

        res.redirect(301, "/");
    });

    app.get("/about", (req, res) => {
        res.render("about", {});
    });

    app.get('/favicon.ico', (req, res) => {
        return 'your faveicon'
    });

    app.get("/:customListName", async (req, res) => {
        const customListName = req.params.customListName;
        const isListThere = await List.model.findOne({ name: customListName }).exec();


        if (Object.is(isListThere, null)) {
            createNewDocuments(new List.model({
                name: customListName,
                items: []
            }));
            res.redirect("/" + customListName);
        }
        else {
            console.log(isListThere);

            res.render("index", {
                listTitle: customListName + " Items",
                newItems: isListThere.items,
                redirect: "/" + customListName
            });
        }
    });

}

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
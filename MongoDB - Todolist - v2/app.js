const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname + "/date.js");

const newItems = [ "دیدن 10 قسمت از دوره Tailwind" , "خواندن 10 صفحه کتاب" , "نوشتن" ];
const workItems = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));

app.get("/" , (req , res) => {
    const farsiDate = date.getDate();

    const farsiDateFormatted = farsiDate.dayName + "," + farsiDate.day + " ام " + farsiDate.month;

    res.render("index" , {
        listTitle: farsiDateFormatted,
        newItems: newItems,
        redirect: "/"
    });

});

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
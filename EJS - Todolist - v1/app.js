const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

let newItems = [ "دیدن 10 قسمت از دوره Tailwind" , "خواندن 10 صفحه کتاب" , "نوشتن" ];
let workItems = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));

app.get("/" , (req , res) => {
    let today = new Date();
    let kindOfDay;

    // A better way:
    const options = { weekday: 'long' , day: 'numeric' , month: 'long' , year: 'numeric' };
    const farsiDate = {
        dayName: today.toLocaleDateString('fa-IR' , {weekday: options.weekday}),
        day: today.toLocaleDateString('fa-IR' , {day: options.day}),
        month: today.toLocaleDateString('fa-IR' , {month: options.month}),
    };
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
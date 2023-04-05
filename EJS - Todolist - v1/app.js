const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

let newItems = [ "دیدن 10 قسمت از دوره Tailwind" , "خواندن 10 صفحه کتاب" , "نوشتن" ];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));

app.get("/" , (req , res) => {
    let today = new Date();
    let currentDay = today.getDay();
    const weekDays = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
    let kindOfDay;

    // A better way:
    const options = { weekday: 'long' , day: 'numeric' , month: 'long' , year: 'numeric' };
    const farsiDate = {
        dayName: today.toLocaleDateString('fa-IR' , {weekday: options.weekday}),
        day: today.toLocaleDateString('fa-IR' , {day: options.day}),
        month: today.toLocaleDateString('fa-IR' , {month: options.month}),
    };

    if(currentDay <= 6 && currentDay >= 0){
        if(currentDay === 6 || currentDay === 0) {
            kindOfDay = "weekend";
         }
         else {
             kindOfDay = weekDays[currentDay];
         }
    }
    else {
        console.log("Error: Current day is equal to: " + currentDay)
    }
    

    res.render("index" , {
        day: kindOfDay,
        farsiDate: farsiDate,
        newItems: newItems
    });

});

app.post("/" , (req , res) => {
    newItems.push(req.body.newItem);

    res.redirect("/");
});

app.listen(3000 , () => {
    console.log("Server started on port 3000.");
})
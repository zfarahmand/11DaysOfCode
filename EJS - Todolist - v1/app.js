const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine' , 'ejs');

app.get("/" , (req , res) => {
    let today = new Date();
    let currentDay = today.getDay();
    const weekDays = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
    let kindOfDay;

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
    

    res.render("index" , {day: kindOfDay});

});

app.listen(3000 , () => {
    console.log("Server started on port 3000.");
})
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended : true}));

const appId = "93a0654a7e992c36fd68596953ba1243";
const units = "metric";
let country = "iran";
let city = "tehran";
let geoApiURL = "https://api.openweathermap.org/geo/1.0/direct?limit=5&&appid=" + appId;
let apiURL = "https://api.openweathermap.org/data/2.5/weather?units=" + units + "&appid=" + appId;
let countryApiURL = "https://restcountries.com/v3.1/name/";


app.get('/' , function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/' , (req , res) => {
    city = req.body.cityName;
    country = req.body.countryName;

    countryApiURL = countryApiURL + "country";


    https.get(countryApiURL , (rsp) => {
        rsp.on("data" , (data) => {
            var countryCode = JSON.parse(data)[0].ccn3;

            geoApiURL = geoApiURL + "&q=" + city + "," + countryCode;


            https.get(geoApiURL , (response) => {
                response.on("data" , (data1) => {
                    var lat = JSON.parse(data1)[0].lat;
                    var lon = JSON.parse(data1)[0].lon;
        
                    apiURL = apiURL + "&lat=" + lat + "&lon=" + lon;
                    console.log(apiURL);
        
                    https.get(apiURL , (response2) => {
                        response2.on("data" , (data) => {
                            console.log(JSON.parse(data));
                            var weatherDesc = JSON.parse(data).weather[0].description;
                            var weatherTemprature = JSON.parse(data).main.temp;
                            var weatherIcon = JSON.parse(data).weather[0].icon;
                            var imageUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                
                            res.write("<p>The weather is currently " + weatherDesc + ". </p>");
                            res.write("<h1>The temprature in " + city + " is " + weatherTemprature + " degrees Celcius.</h1>");
                            res.write("<img src='" + imageUrl + "' >");
                            res.send();
                        });
                    });
        
                });
            });
        });
    });
    
});




app.listen(3000 , function() {
    console.log("Server is running on port 3000.");
});
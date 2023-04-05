const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const APIKey = "a1818020f151a8918c3dbcef17aa0f751-us21";
const listID = "058731cd0d";
const serverPrefix = "us21";
const url = "https://" + serverPrefix + ".api.mailchimp.com/3.0/lists/" + listID;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: 'POST',
        auth: "anystring:" + APIKey
    };
    
    const request = https.request(url , options , (response) => {
        response.on("data" , (data) => {
            if(response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

    // res.send();
});


app.post("/failure" , (req , res) => {
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
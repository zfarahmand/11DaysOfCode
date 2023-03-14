const express = require('express');
const app = express();

app.get("/" , function(request , response) {
    response.send("<h1>Hello, baby!</h1>");
});

app.get("/contact" , function(request , response) {
    response.send("Contact me at: zfarahmand1992@gmail.com");
});

app.get("/about" , function(request , response) {
    response.send("Hello! It's me myself!");
});

app.listen(3000 , function() {
    console.log("Server is running on port 3000.");
});
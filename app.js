var express = require('express');
var app = express();

app.get('/', function(request, response) {
  response.json("OK");
});

app.listen(3000);
console.log("Server is running on port " + 3000);

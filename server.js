const express = require("express");
var app = express();

const port = process.env.PORT || 8081;

app.use(express.static(__dirname + "/public"));

app.listen(port, function() {
	console.log( "server is up and running on port 8080")
})

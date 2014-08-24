var express = require('express');
var config = {port: process.env.PORT || 5000};


var cors = function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET POST PUT DELETE PATCH");
	res.header("Access-Control-Allow-Headers", "Content-Type Accept");
	next();
}
var app = express();

app.use(express.static(__dirname + "/app/www/"));

app.listen(config.port, function(){
	console.log("Server started on port ", config.port);
});


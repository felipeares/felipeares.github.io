const express = require('express');
const app = express();
var path = require("path");
var fs = require('fs');

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/error', function (req, res) {
	res.sendFile(path.join(__dirname+'/error.html'));
});


app.use(express.static('./'));

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

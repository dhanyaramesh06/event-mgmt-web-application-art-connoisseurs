const express = require('express');

var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(express.urlencoded())

var controller = require("./controller/connection");

app.use("/",controller);


app.listen(8080, function () {
    console.log('Server started at 8080');
});

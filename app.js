const express = require('express');
var session = require('express-session');

var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(express.urlencoded())
app.use(session({secret: 'UserConnectionSession'}));

var connectionController = require('./controller/connectionController');
var profileController = require('./controller/profileController');
var otherRoutingController = require('./controller/otherRoutingController');

app.use("/", otherRoutingController);
app.use("/", connectionController);

app.use('/savedConnections', profileController);
app.use('/signout', profileController);

app.listen(8080, function () {
    console.log('Server started at 8080');
});

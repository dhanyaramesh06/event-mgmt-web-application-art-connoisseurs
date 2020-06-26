//Controller to route the connection and connections page

var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

var utility = require('../utility/connectionDB')
var ctgy = utility.category
console.log("Inside connections controller");

router.get('/connection', function (req, res) {
    var query = req.query;
    if(Object.keys(query).length === 0){
      var result = utility.getConnections();
      res.render('connections', {connections:result, category:ctgy, userName: req.session.userName, loggedIn:(req.session.users) ? true : false})
    }
    else{
        var result = utility.getConnection(query.id);
        res.render('connection', {connection:result, userName: req.session.userName, loggedIn:(req.session.users) ? true : false })
    }
});

router.get('/connections', function (req, res) {
    console.log("Inside connections router");
    var result = utility.getConnections();
    res.render('connections', {connections:result, category:ctgy, userName: req.session.userName, loggedIn:(req.session.users) ? true : false})
});

module.exports = router;

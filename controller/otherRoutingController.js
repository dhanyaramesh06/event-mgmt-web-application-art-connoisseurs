//Controller contains route for index, contact, about and new Connection

var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var connectionDB = require('../utility/connectionDB');
var userConnectionDB = require('../utility/userConnectionDB');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

console.log("Inside other routing controller");

router.get('/', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/index', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/newConnection', function (req, res) {
    res.render('newConnection', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/contact', function (req, res) {
    res.render('contact', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/about', function (req, res) {
    res.render('about', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.post('/*', urlEncodedParser, async function (req, res) {
    if(Object.keys(req.body).length == 0){
        res.render('newConnection', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
    else{
        //console.log(req.body);
        await connectionDB.addConnection(req.body);
        res.redirect('/connections');
    }
});

module.exports = router;

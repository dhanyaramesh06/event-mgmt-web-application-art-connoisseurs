//Controller contains route for index, contact, about and new Connection

var express = require('express');
var router = express.Router();
var session = require('express-session');

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

router.post('/saveNewConnection', function (req, res) {
    if(Object.keys(req.body).length === 0){
        res.render('newConnection', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
    else{
        console.log(req.body);
        res.render('newConnection', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
});

module.exports = router;

var express = require('express');
var router = express.Router()

var utility = require('../utility/connectionDB')

router.get('/', function (req, res) {
    res.render('index')
});

router.get('/index', function (req, res) {
    res.render('index')
});

router.get('/connection', function (req, res) {
    var query = req.query;
    if(Object.keys(query).length === 0){
        res.send('No information available or requested.');
    }
    else{
        var result = utility.getConnection(query.id);
        res.render('connection',{connection:result})
    }
});

router.get('/connections', function (req, res) {
    var result = utility.getConnections();
    res.render('connections',{connections:result})
});

router.get('/savedConnections', function (req, res) {
    res.render('savedConnections')
});

router.get('/newConnection', function (req, res) {
    res.render('newConnection')
});

router.get('/contact', function (req, res) {
    res.render('contact')
});

router.get('/about', function (req, res) {
    res.render('about')
});

router.post('/saveNewConnection', function (req, res) {
    if(Object.keys(req.body).length === 0){
        res.render('newConnection');
    }
    else{
        console.log(req.body);
        res.render('newConnection');
    }
});

module.exports = router;

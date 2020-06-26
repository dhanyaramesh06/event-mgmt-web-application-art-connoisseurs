//Controller to route the connection and connections page

var express = require('express');
var router = express.Router();
var session = require('express-session');
var helmet = require('helmet');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

//Sets X-XSS-PROTECTION:1; mode=block"
router.use(helmet.xssFilter());

var utility = require('../utility/connectionDB')
var ctgy;
console.log("Inside connections controller");

//router to redirect to connection detail page for specific connection id
router.get('/connection', async function (req, res) {
    console.log("Inside connection router");
    var query = req.query;
    console.log(query);
    ctgy = await utility.getCategory();
    //rendering the connection catalogue if the request object does not have any parameters
    if(Object.keys(query).length == 0){
      var result = await utility.getConnections();
      res.render('connections', {connections:result, category:ctgy, userName: req.session.userName, loggedIn:(req.session.users) ? true : false})
    }
    else{
      //redirecting to the connection detail page for the selected connection id retrieved from the request
        var result = await utility.getConnection(query.id);
        console.log(result);
        //redirects to Connections page if connection id is not valid -- can happen if URL is tampered manually
        if(result == null || result == undefined){
          res.redirect('/connections')
        }else{
          res.render('connection', {connection:result, userName: req.session.userName, loggedIn:(req.session.users) ? true : false })
        }
    }
});

//router to list all the connections available in the artConnoisseurs database
router.get('/connections', async function (req, res) {
    console.log("Inside connections router");
    ctgy = await utility.getCategory();
    var result = await utility.getConnections();
    console.log(result);
    console.log(ctgy);
    res.render('connections', {connections:result, category:ctgy, userName: req.session.userName, loggedIn:(req.session.users) ? true : false})
});

module.exports = router;

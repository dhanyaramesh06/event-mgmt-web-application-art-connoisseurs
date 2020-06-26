//Controller used for routing to savedConnections and myConnections

var express = require('express');
var router = express.Router();
var session = require('express-session');
var userProfile = require('../models/userProfile');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

console.log("Inside profile controller");

router.get('/myConnections', function(req, res) {
  if (req.session.users == null || req.session.users == undefined) {
        req.session.users = userProfile.getConnections();

  //random user selection
  var randomUser = Math.round(Math.random());

  //setting the selected user details in the session
  req.session.userId = req.session.users[randomUser].userId;
  req.session.userName = req.session.users[randomUser].firstName;
  req.session.userConnections = req.session.users[randomUser].userProfile.userConnections;

  //rendering the saved connections page
  res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
  }
  else{
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false} );
  }
});

router.get('/save', function(req, res) {
  var conid = req.query.conId.toString();
  var rsvp = req.query.rsvp;

  req.session.conId = conid;
  req.session.rsvp = rsvp;

  if (req.session.userConnections == null || req.session.userConnections == undefined) {
      return res.redirect('./myConnections');
  }

  //checking if connection is already present
  var status = userProfile.checkConnection(req.session.userConnections, conid);
  console.log(status);
  if (status) {
    //redirect to update
    return res.redirect('./update');
    } else {
        req.session.userConnections = userProfile.addConnection(req.session.userConnections, rsvp, conid);
    }
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
});

router.get('/update', function(req, res){
    req.session.userConnections = userProfile.updateConnection(req.session.userConnections, req.session.rsvp, req.session.conId );
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

router.get('/remove', function(req, res) {
    var conid = req.query.conId.toString();
    console.log(`Connection with Id ${conid} removed`);

    req.session.userConnections = userProfile.removeConnection(req.session.userConnections, conid);
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

router.get('/signout', function(req, res) {
    userProfile.emptyProfile(req.session);
    return res.redirect('/index');
});

module.exports = router;

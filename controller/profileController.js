//Controller used for routing to savedConnections and myConnections

var express = require('express');
var router = express.Router();
var session = require('express-session');
var userProfile = require('../models/userProfile');
var userConnectionDB = require('../utility/userConnectionDB');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

console.log("Inside profile controller");

router.get('/myConnections', async function(req, res) {
  if (req.session.users == null || req.session.users == undefined) {
        req.session.users = await userProfile.getConnections();

  //random user selection
  var randomUser = Math.round(Math.random());

  //setting the selected user details in the session
  req.session.userId = req.session.users[randomUser].userId;
  req.session.userName = req.session.users[randomUser].firstName;
  req.session.userConnections = await userConnectionDB.getUserProfile(req.session.userId);
  console.log("default user connections");
  console.log(req.session.userConnections);

  //rendering the saved connections page
  res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
  }
  else{
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false} );
  }
});

router.get('/save', async function(req, res) {
  var conid = req.query.conId.toString();
  var rsvp = req.query.rsvp;

  req.session.conId = conid;
  req.session.rsvp = rsvp;

  if (req.session.userConnections == null || req.session.userConnections == undefined) {
      return res.redirect('./myConnections');
  }

  //checking if connection is already present
  var status = await userProfile.checkConnection(conid, req.session.userConnections);
  console.log(status);
  if (status) {
    //redirect to update
    return res.redirect('./update');
    } else {
        req.session.userConnections = await userProfile.addConnection(conid, rsvp, req.session.userConnections, req.session.userId );
    }
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
});

router.get('/update', async function(req, res){
    req.session.userConnections = await userProfile.updateConnection(req.session.conId, req.session.rsvp, req.session.userConnections, req.session.userId );
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

router.get('/remove', async function(req, res) {
    var conid = req.query.conId.toString();
    console.log(`Connection with Id ${conid} removed`);

    req.session.userConnections = await userProfile.removeConnection(req.session.userId, conid);
    res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

router.get('/signout', async function(req, res) {
    await userProfile.emptyProfile(req.session);
    return res.redirect('/index');
});

module.exports = router;

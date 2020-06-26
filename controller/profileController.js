//Controller used for routing to savedConnections and myConnections

var express = require('express');
var router = express.Router();
var session = require('express-session');
var helmet = require('helmet');
var userProfile = require('../models/userProfile');
var userConnectionDB = require('../utility/userConnectionDB');
var connectionDB = require('../utility/connectionDB');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

//Sets X-XSS-PROTECTION:1; mode=block"
router.use(helmet.xssFilter());

console.log("Inside profile controller");

//routes to saved connections page on click of my connections
router.get('/myConnections', async function(req, res) {
    req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.users.firstName+" "+req.session.lastName);
    res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false} );
});

//updating and adding rsvp for a connection
router.get('/save', async function(req, res){
//redirects to savedConnections page if invalid changes are made to URL manually
if(req.query.conId != null || req.query.rsvp != null){
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
        req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.users.firstName+" "+req.session.lastName);
    }
    res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
}else{
  res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
}
});

//router which handles any update on rsvp
router.get('/update', async function(req, res){
    req.session.userConnections = await userProfile.updateConnection(req.session.conId, req.session.rsvp, req.session.userConnections, req.session.userId );
    req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.users.firstName+" "+req.session.lastName);
    res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

//router which handles deleting an rsvp
router.get('/remove', async function(req, res) {
    var conid = req.query.conId.toString();
    console.log(`Connection with Id ${conid} removed`);
    req.session.userConnections = await userProfile.removeConnection(req.session.userId, conid);
    req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.users.firstName+" "+req.session.lastName);
    res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

//router which handles signout functionality
router.get('/signout', async function(req, res) {
    await userProfile.emptyProfile(req.session);
    return res.redirect('/index');
});

//router which handles deleting a connection by the Host
router.get('/deleteConnection', async function(req, res){
  console.log("Inside delete connection router");
  var conid = req.query.conId.toString();
  console.log(conid);
  await connectionDB.deleteConnectionById(conid);
  await userConnectionDB.deleteConnection(conid);
  console.log(`Connection with Id ${conid} removed`);
  req.session.userConnections = await userConnectionDB.getUserProfile(req.session.userId);
  req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.userName+" "+req.session.lastName);
  res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
});

module.exports = router;

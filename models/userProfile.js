//structure of userProfile object and functions associated to user profile
var conObj = require('../utility/connectionDB')
var userObj = require('../utility/userDB')
var userConObj = require('../models/userConnection')
var userConnectionDB = require('../utility/userConnectionDB')

var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

var users = userObj.getAllUsers();
console.log(users);

function userProfile(userId, userConnections){
  console.log("Inside user profile");
  var profileModel = {
    userId : '' + userId,
    userConnections : userConnections
  }
  return profileModel;
}

//adding a new connection to the user profile upon selection of rsvp
async function addConnection(conId, rsvp, userConnections, userId){
  console.log("Inside add connection");
  var con = await conObj.getConnection(conId);
  console.log(con);
  //checking if conId is invalid -- can happen if any invalid changes made in URL manually
  if(con != null || con != undefined){
    await userConnectionDB.addRsvp(userId, con.id, con.name, con.category, rsvp );
    var userConnections = await userConnectionDB.getUserProfile(userId);
    return userConnections;
  }
  return userConnections;
}

//removing a connection from the user profile upon clicking of delete button
async function removeConnection(userId, conId){
  console.log("Inside remove connection");
  await userConnectionDB.deleteUserConnection(userId, conId);
  var profile = await userConnectionDB.getUserProfile(userId);
  return profile;
}

//updating an existing connection in user profile upon clicking of update button
async function updateConnection(conId, rsvp, userConnections, userId){
  console.log("Inside update connection");
  //checks if rsvp has any one of the three values -- if rsvp in URL is tampered manually changes will not be made
  if(rsvp == "Yes" || rsvp == "No" || rsvp == "Maybe"){
    await userConnectionDB.updateRsvp(conId, userId, rsvp);
    var userConnections = await userConnectionDB.getUserProfile(userId);
    return userConnections;
  }
  return userConnections;
}

//checking if the user profile already has the selected connection
//this function helps to route to either addConnection or updateConnection
async function checkConnection(conId, userConnections){
  console.log("Inside check connection");
  var conn = await userConnections.find(x => x.conId == conId);
  if(conn == null || conn == undefined){
    return false;
  }
  return true;
}

//initial connections of the users at the start of session
async function getConnections(){
  console.log("Inside get connections");
  var users = await userObj.getAllUsers();
  return users;
}

//destroying session object inorder to empty the user profile
async function emptyProfile(sessionObject){
  console.log("Inside empty profile");
  sessionObject.destroy();
}

module.exports = {
  userProfile :userProfile,
  addConnection :addConnection,
  removeConnection :removeConnection,
  updateConnection :updateConnection,
  checkConnection :checkConnection,
  getConnections :getConnections,
  emptyProfile :emptyProfile
};

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
// var defaultUserCon = userObj.getDefaultUserCon();
// console.log(defaultUserCon);

//associating each user to it's default connections
// users[0].userProfile = userProfile(users[0].userId, [defaultUserCon[0], defaultUserCon[1]]);
// users[1].userProfile = userProfile(users[1].userId, [defaultUserCon[2], defaultUserCon[3]]);
//
// console.log(users[0].userProfile);

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
  await userConnectionDB.addRsvp(userId, con.id, con.name, con.category, rsvp );
  var userConnections = await userConnectionDB.getUserProfile(userId);
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
  //console.log(`Connection id ${conId} updated`);
  await userConnectionDB.updateRsvp(conId, userId, rsvp);
  var userConnections = await userConnectionDB.getUserProfile(userId);
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

var conObj = require('../utility/connectionDB')
var userObj = require('../utility/userDB')
var userConObj = require('../models/userConnection')
var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

var users = userObj.getUsers();
console.log(users);
var defaultUserCon = userObj.getDefaultUserCon();
console.log(defaultUserCon);

//associating each user to it's default connections
users[0].userProfile = userProfile(users[0].userId, [defaultUserCon[0], defaultUserCon[1]]);
users[1].userProfile = userProfile(users[1].userId, [defaultUserCon[2], defaultUserCon[3]]);

console.log(users[0].userProfile);

function userProfile(userId, userConnections){
  console.log("Inside user profile");
  var profileModel = {
    userId : '' + userId,
    userConnections : userConnections
  }
  return profileModel;
}

//adding a new connection to the user profile upon selection of rsvp
function addConnection(userConnections, rsvp, conId){
  console.log("Inside add connection");
  var con = conObj.getConnection(conId);

  var newCon = userConObj.userConnection(con.id, con.name, con.category, rsvp);
  console.log(`Connection with id ${conId} added to the user profile`);
  userConnections.push(newCon);
  return userConnections;
}

//removing a connection from the user profile upon clicking of delete button
function removeConnection(userConnections, conId){
  console.log("Inside remove connection");
  console.log(`Connection with id ${conId} removed from the user profile`);
  for(var i = userConnections.length-1; i >= 0; i--){
    if(userConnections[i].conId == conId){
      userConnections.splice(i,1);
    }
  }
  return userConnections;
}

//updating an existing connection in user profile upon clicking of update button
function updateConnection(userConnections, rsvp, conId){
  console.log("Inside update connection");
  console.log(`Connection id ${conId} updated`);
  userConnections.forEach(function(index){
    if(index.conId == conId){
      index.rsvp = rsvp;
    }
  });
  return userConnections;
}

//checking if the user profile already has the selected connection
//this function helps to route to either addConnection or updateConnection
function checkConnection(userConnections, conId){
  console.log("Inside check connection");
  var conn = userConnections.find(x => x.conId == conId);
  if(conn == null || conn == undefined){
    return false;
  }
  return true;
}

//initial connections of the users at the start of session
function getConnections(){
  console.log("Inside get connections");
  var users = userObj.getUsers();
  return users;
}

//destroying session object inorder to empty the user profile
function emptyProfile(sessionObject){
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

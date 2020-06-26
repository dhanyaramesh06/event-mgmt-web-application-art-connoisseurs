var userMod = require('../models/user')
var userConnObj = require('../models/userConnection')
//var userProfileObj = require('../models/userProfile')

var user1 = userMod.userModel("jroy2", "Julio", "Roy", "jroy2@gmail.com", "3956 Harry Place", "", "Charlotte", "North Carolina", "28202", "USA");
var user2 = userMod.userModel("akaur1", "Aayushi", "Kaur", "akaur1@gmail.com", "1111 Marcus Ave", "#M28", "New Hyde Park", "New York", "11042", "USA");

var allUsers = [user1, user2];

var userCon1 = userConnObj.userConnection("course1", "Artist Guild - Fine Arts", "Courses", "Yes");
var userCon2 = userConnObj.userConnection("workshop1", "LIVE Portrait Sketching Workshop", "Workshops", "Maybe");
var userCon3 = userConnObj.userConnection("course4", "The Touch of Tradition - Tanjore Painting", "Courses", "Maybe");
var userCon4 = userConnObj.userConnection("workshop3", "Tanjore Painting Workshop", "Workshops", "No");

var defaultUserCon = [userCon1, userCon2, userCon3, userCon4];

// user1.userProfile = userProfileObj.userProfile("jroy2", [userCon1, userCon2]);
// user2.userProfile = userProfileObj.userProfile("akaur1", [userCon3, userCon4]);
//userProfileObj.userProfile(1,2);

function getUsers(){
  return allUsers;
}

function getDefaultUserCon(){
  return defaultUserCon;
}

module.exports = {getUsers, getDefaultUserCon};

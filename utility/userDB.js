// var userConnObj = require('../models/userConnection')
//var userProfileObj = require('../models/userProfile')

// var user1 = userMod.userModel("jroy2", "Julio", "Roy", "jroy2@gmail.com", "3956 Harry Place", "", "Charlotte", "North Carolina", "28202", "USA");
// var user2 = userMod.userModel("akaur1", "Aayushi", "Kaur", "akaur1@gmail.com", "1111 Marcus Ave", "#M28", "New Hyde Park", "New York", "11042", "USA");
//
// var allUsers = [user1, user2];
//
// var userCon1 = userConnObj.userConnection("course1", "Artist Guild - Fine Arts", "Courses", "Yes");
// var userCon2 = userConnObj.userConnection("workshop1", "LIVE Portrait Sketching Workshop", "Workshops", "Maybe");
// var userCon3 = userConnObj.userConnection("course4", "The Touch of Tradition - Tanjore Painting", "Courses", "Maybe");
// var userCon4 = userConnObj.userConnection("workshop3", "Tanjore Painting Workshop", "Workshops", "No");
//
// var defaultUserCon = [userCon1, userCon2, userCon3, userCon4];

// user1.userProfile = userProfileObj.userProfile("jroy2", [userCon1, userCon2]);
// user2.userProfile = userProfileObj.userProfile("akaur1", [userCon3, userCon4]);
//userProfileObj.userProfile(1,2);

//contains connection to artConnoisseurs database and handles all transactions for users collection

var user = require('../models/user')
var mongoose = require('mongoose');
var passwordHash = require('../utility/PasswordHashing');
mongoose.connect('mongodb://localhost/artConnoisseurs', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to artConnoisseurs database");
});

var userSchema = new mongoose.Schema({
    userId: {type: String},
    password: {type: Object},
    firstName: {type: String},
    lastName: {type: String},
    emailAddress: {type: String},
    address1: {type: String},
    address2: {type: String},
    city: {type: String},
    state: {type: String},
    zipcode: {type: String},
    country: {type: String}
});

var users = mongoose.model('users', userSchema);

//returns all the registered users of the application
async function getAllUsers(){
    var allUsers = await users.find();
    return allUsers;
}

//returns the registered user based on user id
async function getUser(id){
    var oneUser = await users.findOne({userId: id});
    return oneUser;
}

//verifies password correctness - helps during login credentials validation
async function checkUser(user){
  console.log("Inside check user");
  var usr = await users.find({userId: user.uname});
  console.log(usr);
  console.log(usr[0].password);
  var decryptedPwd = passwordHash.decryptPwd(usr[0].password);
  console.log(decryptedPwd);
  if(usr.length == 0 || decryptedPwd != user.pwd){
    return false;
  }
  return true;
}

//verifies if a user id already exists in DB -- helps during signup
async function checkUserID(user){
  console.log("Inside check if user ID exists");
  var usr = await users.find({userId: user.userid});
  console.log(usr);
  if(usr.length == 0){
    return true;
  }
  return false;
}

//adds a new user to the users collection
async function addUser(user){
  console.log("Inside add new user");
  var encryptedPwd = passwordHash.encryptPwd(user.pwd);
  console.log("encrypted password: "+encryptedPwd);
  var newUser = new users({"userId": user.userid, "password": encryptedPwd, "firstName": user.fname, "lastName": user.lname, "emailAddress": user.email, "address1": user.address1, "address2": user.address2, "city": user.city, "state": user.state, "zipcode": user.zip, "country": user.country});
  console.log(newUser);
  await newUser.save();
}

module.exports = {getAllUsers, getUser, checkUser, checkUserID, addUser};

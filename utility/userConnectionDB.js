//contains connection to artConnoisseurs database and handles all transactions for userconnections collection
var connection = require('../models/connection')
var userConn = require('../models/userConnection')
var connectionDB = require('../utility/connectionDB')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/artConnoisseurs', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to artConnoisseurs database");
});

var userConnectionSchema = new mongoose.Schema({
    userId: {type: String},
    conId: {type: String},
    conName: {type: String},
    category: {type: String},
    rsvp: {type: String}
});

var userconnections = mongoose.model('userconnections', userConnectionSchema);

//returns the user profile from userconnections based on user id
async function getUserProfile(uid){
  console.log("inside get user profile");
  console.log(uid);
    var oneUserProfile = await userconnections.find({userId: uid}, function(err, data){
      return data;
    });
    //console.log("inside get user profile");
    console.log(oneUserProfile);
    return oneUserProfile;
}

//function that enables updating a rsvpied connection
async function updateRsvp(conid, uid, rsvp){
  console.log("inside update rsvp");
  await userconnections.updateOne({userId: uid, conId: conid}, {$set : {rsvp: rsvp}}, function(err, data){
    console.log('User connection updated successfully'+JSON.stringify(data));
  });
}

//function that supports adding a connection along with rsvp
async function addRsvp(uid, conid, connName, category, rsvp){
  console.log("inside add rsvp");
  var createUserConn = new userconnections({"userId": uid, "conId": conid, "conName": connName, "category": category, "rsvp": rsvp});
  console.log(createUserConn);
  await createUserConn.save();
}

//function that supports deleting a rsvpied connection
async function deleteUserConnection(uid, conid){
  console.log("inside delete user connection");
    await userconnections.deleteOne({userId: uid, conId: conid}, function(err, data){
      console.log(`Deleted connection with id:${conid} from the UserId:${uid}`);
    });
}

//function that supports removing a rsvpied connection from other user's profile if the connection's host deletes them
async function deleteConnection(conid){
  console.log("Deleting the connection from user profile who have shared this");
    await userconnections.deleteMany({conId: conid}, function(err, data){
      console.log(`Deleted connection with id:${conid} for all users who rsvpied for this`);
    });
}

module.exports = {
    getUserProfile :getUserProfile,
    updateRsvp :updateRsvp,
    addRsvp :addRsvp,
    deleteUserConnection :deleteUserConnection,
    deleteConnection :deleteConnection
}

//Controller contains route for index, contact, about and new Connection

var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var connectionDB = require('../utility/connectionDB');
var userConnectionDB = require('../utility/userConnectionDB');
var userDB = require('../utility/userDB');
const{check, validationResult} = require('express-validator');

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

console.log("Inside other routing controller");

router.get('/', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/index', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/savedConnections/index', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/newConnection', function (req, res) {
  if(req.session.users == null || req.session.users == undefined){
    res.render('login', {error:[{msg:"Please login to create a new connection"}],loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
  }else{
    res.render('newConnection', {error:"",loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
  }
});

router.get('/contact', function (req, res) {
    res.render('contact', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/about', function (req, res) {
    res.render('about', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.get('/login', function (req, res) {
    res.render('login', {error:"",loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

router.post('/loggedIn', urlEncodedParser, [check('uname').not().isEmpty().withMessage('Username field cannot be empty').not().isEmail().withMessage('Username should be user ID'),
check('pwd').not().isEmpty().withMessage('Password field cannot be empty')], async function (req, res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('login', {error: errors.array(), loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    //return res.status(422).json({errors: errors.array()});
  }
  else{
    var exists = await userDB.checkUser(req.body);
    console.log(exists);
    if(exists){
      req.session.users = await userDB.getUser(req.body.uname);
      req.session.userId = req.session.users.userId;
      req.session.userName = req.session.users.firstName;
      req.session.userConnections = await userConnectionDB.getUserProfile(req.session.userId);
      return res.render('savedConnections', { userConnections: req.session.userConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
    }
    else{
      return res.render('login', {error: [{msg:"Invalid Credentials"}], loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
  }
});

router.post('/saveNewConnection', urlEncodedParser, [check('topic').isLength({min: 3}).withMessage('Category name must be atleast 3 characters long'),
check('topicId').isLength({min: 3}).withMessage('Connection ID must be atleast 3 characters long'),
check('name').isLength({min: 3}).withMessage('Connection name must be atleast 3 characters long'),
check('host').isLength({min: 3}).withMessage('Host name must be atleast 3 characters long'),
check('when').not().isEmpty().withMessage('Date field cannot be empty'),
check('where').isLength({min: 3}).withMessage('Location must be atleast 3 characters long'),
check('from').not().isEmpty().withMessage('Start time cannot be empty'),
check('to').not().isEmpty().withMessage('End time cannot be empty'),
check('details').isLength({min: 10}).withMessage('Connection details must be atleast 10 characters long')],
async function (req, res) {
  const errors = validationResult(req);
  console.log(errors);
  if(!errors.isEmpty()){
    return res.render('newConnection', {error: errors.array(), loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
  }
  else{
    var exists = await connectionDB.checkConnection(req.body);
    if(exists){
      await connectionDB.addConnection(req.body);
      res.redirect('/connections');
    }
    else{
      return res.render('newConnection', {error: [{msg:"Connection ID "+ req.body.topicId+ " already exists"}], loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
  }
});

module.exports = router;

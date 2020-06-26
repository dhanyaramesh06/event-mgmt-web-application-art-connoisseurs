//Controller contains route for index, contact, about , login, sign up and new Connection pages
//

var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var connectionDB = require('../utility/connectionDB');
var userConnectionDB = require('../utility/userConnectionDB');
var userDB = require('../utility/userDB');
var dateFormat = require('dateformat');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var helmet = require('helmet');
const{check, validationResult} = require('express-validator');
var csrfProtection = csrf({cookie: true});

router.use(cookieParser());

//Sets X-XSS-PROTECTION:1; mode=block"
router.use(helmet.xssFilter());

router.use(session({
    secret: 'UserConnectionSession',
    cookie: { secure: true }
}));

console.log("Inside other routing controller");

//routes to the index page
router.get('/', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

//routes to the index page
router.get('/index', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

//routes to the index page
router.get('/savedConnections/index', function (req, res) {
    res.render('index', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

//routes to the new connection form if a user has logged in
//csrf attack prevented by generating csrf tokens
router.get('/newConnection', csrfProtection, function (req, res) {
  if(req.session.users == null || req.session.users == undefined){
    res.render('login', {error:[{msg:"Please login to create a new connection"}],loggedIn: (req.session.users) ? true: false, userName: req.session.userName, csrfToken: req.csrfToken()})
  }else if(req.query.con != null || req.query.con != undefined){
    var obj = JSON.parse(req.query.con);
    var date = dateFormat(obj.date, "yyyy-mm-dd");
    console.log(obj);
    console.log(date);
    res.render('newConnection', {error:"", modifyConnection: obj, date: date, loggedIn: (req.session.users) ? true: false, userName: req.session.userName, lastName: req.session.lastName, csrfToken: req.csrfToken()})
  }
  else{
    res.render('newConnection', {error:"", modifyConnection: null, date: null, loggedIn: (req.session.users) ? true: false, userName: req.session.userName, lastName: req.session.lastName, csrfToken: req.csrfToken()})
  }
});

//routes to the contact page
router.get('/contact', function (req, res) {
    res.render('contact', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

//routes to the about page
router.get('/about', function (req, res) {
    res.render('about', {loggedIn: (req.session.users) ? true: false, userName: req.session.userName})
});

//routes to the login page
//csrf attack prevented by generating csrf tokens
router.get('/login', csrfProtection, function (req, res) {
    res.render('login', {error:"", loggedIn: (req.session.users) ? true: false, userName: req.session.userName, csrfToken: req.csrfToken()})
});

//routes to the signup page
//csrf attack prevented by generating csrf tokens
router.get('/signup', csrfProtection, function (req, res) {
    res.render('signup', {error:"", loggedIn: (req.session.users) ? true: false, userName: req.session.userName, csrfToken: req.csrfToken()})
});

//router which handles the validation of login credentials and redirects to my connections page
//csrf attack prevented by validating csrf tokens
router.post('/loggedIn', urlEncodedParser, csrfProtection, [check('uname').not().isEmpty().withMessage('Username field cannot be empty').not().isEmail().withMessage('Username should be user ID'),
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
      req.session.lastName = req.session.users.lastName;
      req.session.userConnections = await userConnectionDB.getUserProfile(req.session.userId);
      req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.users.firstName+" "+req.session.lastName);
      return res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false});
    }
    else{
      return res.render('login', {error: [{msg:"Invalid Credentials"}], loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
  }
});

//router which handles the validation of new connection form and creates new connection in database
//csrf attack prevented by validating csrf tokens
router.post('/saveNewConnection', urlEncodedParser, csrfProtection, [check('topic').isLength({min: 3}).withMessage('Category name must be atleast 3 characters long'),
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
    return res.render('newConnection', {error: errors.array(), modifyConnection: null, date: null, loggedIn: (req.session.users) ? true: false, userName: req.session.userName, lastName: req.session.lastName});
  }
  else{
    var exists = await connectionDB.checkConnection(req.body);
    if(exists){
      await connectionDB.addConnection(req.body);
      res.redirect('/connections');
    }
    else{
      return res.render('newConnection', {error: [{msg:"Connection ID "+ req.body.topicId+ " already exists"}], modifyConnection: null, date: null, loggedIn: (req.session.users) ? true: false, userName: req.session.userName, lastName: req.session.lastName});
    }
  }
});

//router which handles the validation of signup form and creates new user in database
//csrf attack prevented by validating csrf tokens
router.post('/saveNewUser', urlEncodedParser, csrfProtection, [check('fname').isLength({min: 3}).withMessage('Name should be alphabetical and atleast 3 characters long'),
check('email').isEmail().withMessage('Enter a valid email id'),
check('userid').not().isEmail().withMessage('User ID should not be email id').isLength({min: 3}).withMessage('User ID should be atleast 3 characters long'),
check('address1').isLength({min: 5}).withMessage('Address must be alphabetical and atleast 5 characters long'),
check('city').isLength({min: 3}).withMessage('City must be alphabetical and atleast 3 characters long'),
check('state').isLength({min: 2}).withMessage('State must be alphabetical and atleast 2 characters long'),
check('country').isLength({min: 3}).withMessage('Country must be alphabetical and atleast 3 characters long'),
check('zip').isLength({min: 5}).withMessage('Invalid zip code'),
check('pwd').isAlphanumeric().withMessage('Password must be alphanumeric').isLength({min: 6}).withMessage('Password must be atleast 6 characters long')],
async function(req, res){
  const errors = validationResult(req);
  console.log(errors);
  if(!errors.isEmpty()){
    return res.render('signup', {error: errors.array(), loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
  }else{
    var exists = await userDB.checkUserID(req.body);
    if(exists){
      await userDB.addUser(req.body);
      res.redirect('/login');
    }
    else{
      return res.render('signup', {error: [{msg:"User ID "+ req.body.userid+ " already exists. Choose another User ID"}], loggedIn: (req.session.users) ? true: false, userName: req.session.userName});
    }
  }
});

//router which handles any update to a connection by the host
//csrf attack prevented by validating csrf tokens
router.post('/editConnection', urlEncodedParser, csrfProtection, [check('topic').isLength({min: 3}).withMessage('Category name must be atleast 3 characters long'),
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
    return res.render('newConnection', {error: errors.array(), modifyConnection: null, date: null, loggedIn: (req.session.users) ? true: false, userName: req.session.userName, lastName: req.session.lastName});
  }else{
    await connectionDB.modifyConnection(req.body);
    req.session.userConnections = await userConnectionDB.getUserProfile(req.session.userId);
    req.session.userHostConnections = await connectionDB.getConnectionByHost(req.session.userName+" "+req.session.lastName);
    res.render('savedConnections', { userConnections: req.session.userConnections, userHostConnections: req.session.userHostConnections, userName: req.session.userName, loggedIn: (req.session.users) ? true: false });
  }
});

module.exports = router;

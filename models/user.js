var user = function(uid, fname, lname, email, addr1, addr2, city, state, zip, country)
{
  var usermodel = {
    userId : '' + uid,
    firstName : '' + fname,
    lastName : '' + lname,
    emailAddress : '' + email,
    address1 : '' + addr1,
    address2 : '' + addr2,
    city : '' + city,
    state : '' + state,
    zipcode : '' + zip,
    country : '' + country
  }
  return usermodel;
}

module.exports = user

var userConn = function(userId, conId, conName, category, rsvp)
{
  var userConnModel = {
    userId : '' + userId,
    conId : '' + conId,
    conName : '' + conName,
    category : '' + category,
    rsvp : '' + rsvp
  }
  return userConnModel;
}

module.exports = userConn

var userConn = function(conId, conName, category, rsvp)
{
  var userConnModel = {
    conId : '' + conId,
    conName : '' + conName,
    category : '' + category,
    rsvp : '' + rsvp
  }
  return userConnModel;
}

module.exports.userConnection = userConn

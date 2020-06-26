//structure of connection object
var connection = function(conID, conName, conCategory, conDetails, conLocation, conDate, conFromTime, conToTime, conHostedBy)
{
  var conModel = {
    id : '' + conID,
    name : '' + conName,
    category : '' + conCategory,
    details : '' + conDetails,
    location : '' + conLocation,
    date : '' + conDate,
    fromTime : '' + conFromTime,
    toTime : '' + conToTime,
    hostedBy : '' + conHostedBy
  }
  return conModel;
}

module.exports = connection

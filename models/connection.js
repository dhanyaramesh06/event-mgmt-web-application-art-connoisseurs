var connection = function(conID, conName, conCategory, conDetails, conLocation, conDate, conFromTime, conToTime, conHostedBy, img)
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
    hostedBy : '' + conHostedBy,
    image : img
  }
  return conModel;
}

module.exports.connectionModel = connection

var connection = function(conID, conName, conTopic, conDetails, conLocation, conDate, conFromTime, conToTime)
{
  var model = {
    connectionID : '' + conID,
    connectionName : '' + conName,
    connectionTopic : '' + conTopic,
    connectionDetails : '' + conDetails,
    connectionLocation : '' + conLocation,
    connectionDate : '' + conDate,
    connectionTime : '' + conFromTime + '-' + conToTime,
    connectionHostedBy : 'User'
  }
  return model;
}

module.exports.connectionModel = connection

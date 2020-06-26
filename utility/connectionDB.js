const fs = require('fs');

function getConnections(){
    let rawdata = fs.readFileSync('./utility//database.json');
    let connections = JSON.parse(rawdata);
    var result = {
        "courses":[],
        "workshops":[]
    }
    for(conn of connections.courses.connections){
        result.courses.push({
            "connection_name": conn.connection_name,
            "id" : conn.id
        });
    }
    for(conn of connections.workshops.connections){
        result.workshops.push({
            "connection_name": conn.connection_name,
            "id" : conn.id
        });
    }
    return result;
}

function getConnection(id){
    let rawdata = fs.readFileSync('./utility/database.json');
    let connection = JSON.parse(rawdata);
    var result = {}
    for(conn of connection.courses.connections){
        if(conn.id == id)
            result = conn;
    }
    for(conn of connection.workshops.connections){
        if(conn.id == id)
            result = conn;
    }
    return result;
}

module.exports = {
    getConnection :getConnection,
    getConnections :getConnections
}

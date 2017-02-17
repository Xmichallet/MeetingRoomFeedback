// Function triggered by IOT AWS Button
// Insert the action Good / Bad  + Meeting room + Date into dynamodb table MeetingRoom_Feedback

var creds = require('config.json');

exports.handler = function(event, context) {

    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var doc = require('dynamodb-doc');
    var dynamodb = new doc.DynamoDB();
    var feedback = "Unknown";

    if (event.serialNumber == creds.IoTBad){
        feedback = "Bad";    
    }
    
    if (event.serialNumber == creds.IoTGood){
        feedback = "Good";    
    }

    console.log(feedback);
	
    if (feedback != "Unknown"){
    
        var tableName = creds.tableName;
        var meetingroom = creds.meetingroom;
        var timestamp = new Date().toISOString().replace(/T/, '').replace(/\..+/, '').replace(/:/g,'').replace(/-/g,'');
    
    
        var item = {
            "meetingroom": meetingroom, 
            "feedback": feedback,
            "timestamp": timestamp,
        };
    
    var params = {
        TableName : tableName,
        Key: {
            meetingroom: meetingroom,
            timestamp: timestamp, 
        },
        UpdateExpression: 'SET #feedback=:feedback',
        ExpressionAttributeNames: {
        '#feedback' : 'feedback'
        },
        ExpressionAttributeValues: {
         ":feedback":feedback
        } 
    };
    
    console.log("Item:\n", item);
    console.log("params:\n", params);

        dynamodb.updateItem(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('SUCCESS');
            }
        });   
    };
       
        
};
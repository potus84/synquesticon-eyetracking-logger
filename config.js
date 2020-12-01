const connection_string = require('./connection_string')
var config = {};

config.eyeTrackingSchema = {  
    eyeTrackerSerialNumber: String,
    user: { 
        uid: String 
    },
    timestamp: {type: Number, unique: true, index: true},
    startTime: Number,
    sampleCount: Number,
    recordingCount: Number,
    data: [
        {
            gaze: {
                x: Number,
                y: Number
            },
            pupilDiameter: {
                LeftEye: Number,
                RightEye: Number
            },
            GazePoint_PositionOnDisplayArea: {
                LeftEye: {
                    x: Number,
                    y: Number
                },
                RightEye: {
                    x: Number,
                    y: Number
                }
            },
            GazeOrigin_PositionInUserCoordinates: {
                LeftEye: {
                    x: Number,
                    y: Number,
                    z: Number
                },
                RightEye: {
                    x: Number,
                    y: Number,
                    z: Number
                }  
            }
        }
    ],
    tag: String
}

config.mongodbURI = connection_string.cosmosdbURI,

config.mqttBroker = connection_string.mqttBroker

config.testLocalhost = {
    mongodbURI: "mongodb://localhost:27017/Synquesticon",
    mqttBroker: "wss://syn.ife.no/mqtt"
}

config.windowSize = 60




config.topicsToSubscribe = {
    eyeTracker:     'sensor/gaze/',
    taskLoaded:     'onTaskLoaded/'
}


module.exports=config;
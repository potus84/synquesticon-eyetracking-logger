const mqtt = require('mqtt')
const mongodb = require('mongodb')
const mongoose = require("mongoose")
const config = require('./config')

const Schema = mongoose.Schema

const ETSchema = new Schema(
    config.eyeTrackingSchema,
    { collection: 'Eye_Tracking' }
)

const args = process.argv.slice(2)

var mqttBroker = config.mqttBroker
var mongodbURI = config.mongodbURI

const testMode = (args[0] == "test")

if(testMode){
    mqttBroker = config.testLocalhost.mqttBroker
    mongodbURI = config.testLocalhost.mongodbURI
}


const ET = mongoose.model("ET", ETSchema)

const mqttTopics = config.topicsToSubscribe



let mongodbClient = mongodb.MongoClient

const setUpConnection = (err, client) => {
    if (err) throw err
    console.log('ET logging db created')

    let db = mongoose.connection
    db.once("open", () => console.log("Connected to the database"))
    // checks if connection with the database is successful
    db.on("error", console.error.bind(console, "MongoDB connection error:"))
    mongoose.connect(mongodbURI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000
    })
    mqttClient = mqtt.connect(mqttBroker, 
        {rejectUnauthorized: false}
    )

    mqttClient.on('connect', function () {
        console.log("ET logger connected to mqtt broker")
        for(topic in mqttTopics){
            mqttClient.subscribe(mqttTopics[topic] + "#", function (err) { if (err) { console.log(err) } })
        }
            
        

    })
    mqttClient.on('message', handleMessages)
}

mongodbClient.connect(mongodbURI,
    { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 60000, socketTimeoutMS: 60000 },
    setUpConnection)


var tag = ""

var data = []

var testData = []

const windowSize = config.windowSize

function handleMessages(topic, message) {
    message = JSON.parse(message)
    if(topic.startsWith(mqttTopics.taskLoaded)){
        receivedTimestamp = Date.now()
        setTags = message.setTags.join('_')
        taskTags = message.taskTags.join('_')
        tag = [setTags, taskTags, receivedTimestamp].join('_')
        console.log("Tag: ", tag)

    } else if(topic.startsWith(mqttTopics.eyeTracker)){
        ETObject = message
        if(ETObject.tag == undefined) { //only save message with undefined tag 
            ETObject.tag = tag

            data.push(ETObject)

            if(data.length == windowSize){
                ET.insertMany(data)
                    .catch(error => console.log(error))
                data = []
            }

            
        } else if(ETObject.tag != undefined && testMode){
            testData.push(ETObject)

            if(testData.length == windowSize){
                ET.insertMany(testData)
                .catch(error => console.log(error))

                testData = []                
            }
        }
        else if(ETObject.tag.includes('test_streaming')){
            console.log("Test streaming, not logged")
        }

    }
    
}
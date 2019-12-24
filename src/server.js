// Set up
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;

// Configuration
mongoose.set("useFindAndModify", false);
async function connect() {
    await mongoose.connect('mongodb://localhost/hotel', {
   useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

connect()

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses


// Models
var Room = mongoose.model('Room', {
    room_number: Number,
    type: String,
    beds: Number,
    cost_per_night: Number,
    reserved: [
        {
            from: String,
            to: String
        }
    ]
});

/*
 * Generate some test data, if no records exist already
 * MAKE SURE TO REMOVE THIS IN PROD ENVIRONMENT
*/

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This will remove the whole database record everytime we restart the server.
Room.remove({}, function(res){
    console.log("removed records");
});

Room.count({}, function(err, count){
    console.log("Rooms: " + count);

    if(count === 0){

        var recordsToGenerate = 50;

        var roomTypes = [
            'standard',
            'studio'
        ];


        // For testing purposes, all rooms will be booked out from:
        // 18th May 2017 to 25th May 2017, and
        // 29th Jan 2018 to 31 Jan 2018

        for(var i = 0; i < recordsToGenerate; i++) {

            var newRoom = {
                room_number: i,
                type: roomTypes[getRandomInt(0,1)],
                beds: getRandomInt(1, 3),
                cost_per_night: getRandomInt(50, 500),
                reserved: [
                    {from: '2019-12-01', to: '2019-12-12'},
                    {from: '2019-12-18', to: '2019-12-20'},
                    {from: '2019-12-23', to: '2019-12-25'}
                ]
            };

           Room.insertMany(newRoom).then( (res) => console.log(res) );
        }

    }
});

// Routes
app.post('/api/rooms', async(req, res) => {

    console.log(JSON.stringify(req.body, null, 2));
   
    try{
        let roomsArray = await Room.find({
        type: req.body.roomType,
        beds: parseInt(req.body.beds),
        cost_per_night: {$gte: parseInt(req.body.priceRange.lower), $lte: parseInt(req.body.priceRange.upper)},
        reserved: { //Check if any of the dates the room has been reserved for overlap with the requsted dates
            $not: {
                $elemMatch: {from: {$lt: req.body.to}, to: {$gt: req.body.from}}
            }
        }    
        })
        console.log('room is '+roomsArray);
        res.send(roomsArray);
    }catch(e){
    res.send(e);
    }
});

    app.post('/api/rooms/reserve', async function(req, res) {
try {
          let reservedRoom = await Room.findOneAndUpdate(
{"_id": ObjectId(req.body._id)},
{"$push": {"reserved": {"from": req.body.from, "to": req.body.to}}},
 );
 res.send("Room reserved" + JSON.stringify(reservedRoom,null,2));
} catch (e) {
 res.send(e)
}
    });

// listen
app.listen(3000);
console.log("App listening on port 3000");


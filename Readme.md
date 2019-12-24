clone from github
Do - npm install

to run the server : node src/server.js
the server will run on port : 3000

The total rooms created would be 50
The number of beds per room would range from 1 to 3
To see the number of rooms use : /api/rooms/ - with  roomType , beds , price and date
To book a particular room use : /api/rooms/reserve - with room ID and date


Test data : 

Dates on which rooms are reserved :
{from: '2019-12-01', to: '2019-12-12'},
{from: '2019-12-18', to: '2019-12-20'},
{from: '2019-12-23', to: '2019-12-25'}

Price range :
lower - 50
upper - 500

beds : 
1,2,3

roomType:
studio and standard


Example for the API :

    Request object for /api/rooms/
    {
        "roomType": "studio",
        "beds": "2",
        "priceRange": {
            "lower": "50",
            "upper": "500"
        },
        "from": "2019-12-13",
        "to": "2019-12-14"
    }

    Request object for /api/rooms/reserve
    {
        "_id" : "5dfcf17f61adf32d0cb522da", -> id of the room that you want to reserve
        "from": "2019-12-17",
        "to": "2019-12-18"
    }


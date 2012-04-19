
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , mongoose = require('mongoose')
    , twitter = require('ntwitter')
    , twit = new twitter({
        consumer_key: 'qbuqlYDgNbC0y4217huiA',
        consumer_secret: 'H9yH4QkmU0Eq4vEULu0douTrJT9imXgwXTHoVL7RnE',
        access_token_key: '196841165-BWDALPGI7O7hZELR9uBZjHoPc7Ujc6f8HjqPIidC',
        access_token_secret: 'mqNxxaBQX0K1XrMlq28gg4C6hlK4rri38eH1Dvz7A'
    })
    , Tweet = require('./models/tweet');

var app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'your secret here' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

mongoose.connect('mongodb://localhost/earthquake');

var saveTweet = function(data, next) {
    if(typeof data === 'object') {
        var tweet = new Tweet({
            created_at : new Date(Date.parse(data.created_at)),
            place : {
                bounding_box : {
                    coordinates: data.place.bounding_box.coordinates,
                    location: {
                        lat: data.location.lat,
                        lng: data.location.lng
                    }
                },
                country : data.place.country,
                country_code : data.place.country_code,
                full_name : data.place.full_name,
                id : data.place.id,
                name : data.place.name,
                place_type: data.place.place_type,
                url : data.place.url
            },
            id_str : data.id_str,
            retweet_count : data.retweet_count,
            source : data.source,
            text : data.text,
            user : {
                id_str : data.user.id_str,
                lang : data.user.lang,
                location : data.user.location,
                screen_name : data.user.screen_name,
                time_zone : data.user.time_zone,
                utc_offset : data.user.utc_offset
            }
        });

        tweet.save(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('saved');
            }
        });   
    }
}

//Twitter Stream On
twit.stream('statuses/filter', {'track':'earthquake'}, function(stream) {
    
    var tooltweet = new Tweet();

    stream.on('data', function (data) {
        //Save tweet here (Mongo)
        if(tooltweet.hasLocation(data)) {
            //console.log('First: ', data.place);
            //console.log('First Bounds', tooltweet.getLocation(data));
            data.location = tooltweet.getLocation(data);
            saveTweet(data);
            return;
        } else if(typeof data.retweeted_status === 'object') {
            if(tooltweet.hasLocation(data.retweeted_status)) {
                //console.log('Second: ', data.retweeted_status.place);
                //console.log('Second Bounds', tooltweet.getLocation(data.retweeted_status));
                data.retweeted_status.location = tooltweet.getLocation(data.retweeted_status);
                    saveTweet(data.retweeted_status);
                return;
            }
        }
        console.log('no location', data.id_str);
      //Trigger socket emission to all
      // Only send if has geo data.
      //Bounding box for flag with google api easily?
      //io.sockets.emit('tweet', {tweet: data});
    }).on('error', function(err, data) {
      console.log(err, data);
    });
});

// Routes
app.get('/', routes.index);

//Init
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

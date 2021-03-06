
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
    , tweet = require('./models/tweet').Tweet();

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

//Twitter Stream On
twit.stream('statuses/filter', {'track':'earthquake'}, function(stream) {
    stream.on('data', function (data) {
        //Save tweet here (Mongo)
        if(tweet.hasLocation(data)) {
            console.log('First: ', data.place);
            console.log('First Bounds', tweet.getLocation(data));
            return;
        } else if(typeof data.retweeted_status === 'object') {
            if(tweet.hasLocation(data.retweeted_status)) {
                console.log('Second: ', data.retweeted_status.place);
                console.log('Second Bounds', tweet.getLocation(data.retweeted_status));
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

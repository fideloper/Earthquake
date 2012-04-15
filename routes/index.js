
/*
 * GET home page.
 */
var twitter = require('ntwitter'),
	twit = new twitter({
    	consumer_key: 'qbuqlYDgNbC0y4217huiA',
    	consumer_secret: 'H9yH4QkmU0Eq4vEULu0douTrJT9imXgwXTHoVL7RnE',
    	access_token_key: '196841165-BWDALPGI7O7hZELR9uBZjHoPc7Ujc6f8HjqPIidC',
    	access_token_secret: 'mqNxxaBQX0K1XrMlq28gg4C6hlK4rri38eH1Dvz7A'
    }),
    tweet = require('../models/tweet');

exports.index = function(req, res){
	twit.stream('statuses/filter', {'track':'earthquake'}, function(stream) {
    	stream.on('data', function (data) {
			//console.log(data);
            //Save tweet here (For now)
    	}).on('error', function(err, data) {
    		console.log(err, data);
    	});
    });
    console.log(tweet);
	res.render('index', { title: 'Express' })
};

/*
 * GET home page.
 */
var twitter = require('ntwitter'),
	twit = new twitter({
    	consumer_key: 'qbuqlYDgNbC0y4217huiA',
    	consumer_secret: 'H9yH4QkmU0Eq4vEULu0douTrJT9imXgwXTHoVL7RnE',
    	access_token_key: '196841165-BWDALPGI7O7hZELR9uBZjHoPc7Ujc6f8HjqPIidC',
    	access_token_secret: 'mqNxxaBQX0K1XrMlq28gg4C6hlK4rri38eH1Dvz7A'
    });

exports.index = function(req, res){
	twit.stream('statuses/filter', {'track':'earthquake'}, function(stream) {
    	stream.on('data', function (data) {
			console.log(data);
            //To be erased
            var exec = require("child_process").exec,
            fs = require('fs');

            fs.writeFile('tmp/formatted.txt', JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('Written');
                 exec("cat tmp/formatted.txt | python -mjson.tool >> tmp/actually_formatted.txt",function(error, stdout, stderr){
                     if(error) { console.log('error', error); }
                     console.log(stdout, stderr);
                 });
            });

            
            //End To be erased

    	}).on('error', function(err, data) {
    		console.log(err, data);
    	});
    });
	res.render('index', { title: 'Express' })
};
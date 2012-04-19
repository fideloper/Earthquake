var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
   	_getBoundariesFromMarkers = function (markers) {
            var i,
            	boundaries,
            	mostN = 1000,
                mostE = -1000,
                mostW = 1000,
                mostS = -1000;
            if(Array.isArray(markers)) {
                for (i = 0; i < markers.length; i += 1) {
                    if(mostN > markers[i][0]) {mostN = markers[i][0]; }
                    if(mostE < markers[i][1]) {mostE = markers[i][1]; }
                    if(mostW > markers[i][1]) {mostW = markers[i][1]; }
                    if(mostS < markers[i][0]) {mostS = markers[i][0]; }
                }
                boundaries = {N: mostN, E: mostE, W: mostW, S: mostS};
            }

            if(mostN == -1000) boundaries = {N: 0, E: 0, W: 0, S: 0};

            return boundaries;
        }

	TweetSchema = new Schema({
		created_at : { type: Date, default: Date.now }, //?? { type: Date, default: Date.now } ?
		place : {
			bounding_box : {
				coordinates: Array,
				location: {
					lat: Number,
					lng: Number
				}
			},
			country : String,
			country_code : String,
			full_name : String,
			id : String,
			name : String,
			place_type:  String,
			url : String
		},
		id_str : String,
		retweet_count : Number,
		source : String,
		text : String,
		user : {
			id_str : String,
			lang : String,
			location : String,
			screen_name : String,
			time_zone : String,
			utc_offset : Number  //?? String?
		}
	});

	TweetSchema.methods.hasLocation = function hasLocation(tweet) {
		if(tweet == null) {return false;}
		var result = false;
		if ( tweet.place !== null && tweet.place.country != null ) {
			result = true;
		} 
		return result;
	}

	TweetSchema.methods.getLocation = function getLocation(tweet) {
		if(typeof tweet === 'object') {
			var bounds = _getBoundariesFromMarkers(tweet.place.bounding_box.coordinates[0]);
			bounds.lng = bounds.S + ((bounds.N - bounds.S)/2);
			bounds.lat = bounds.W + ((bounds.E - bounds.W)/2);
			return bounds;
		}
		return false;
	}



module.exports = mongoose.model('Tweet', TweetSchema);
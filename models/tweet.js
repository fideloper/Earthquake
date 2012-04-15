var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,

	TweetSchema = new Schema({
		created_at : String, //?? { type: Date, default: Date.now } ?
		place : {
			bounding_box : {
				coordinates: Array //?? Allowed type?
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

module.exports = mongoose.model('Tweet', TweetSchema);
var mongoose = require('mongoose');

module.exports = mongoose.model('LocationTime',{
	location: String,
	date: String,
	data: String, 
	time: String, //need way to deserialze + serialize this
	usernames: [String]
});
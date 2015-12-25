var mongoose = require('mongoose');

module.exports = mongoose.model('LocationTime',{
	location: String,
	data: String, //need way to deserialize + serialize
	time: String, //need way to deserialze + serialize this
	usernames: [String]
});
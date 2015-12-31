var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	school: String,
	verified: Boolean,
	verificationCode: String,
	phoneNum: String,
	fbUsername: String,
	fbName: String,
	prefEmail: String,
	signedUpTimes: [String] //SERIALIZED
});
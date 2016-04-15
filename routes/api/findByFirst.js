var User = require('../../models/user.js');

module.exports = function(query, callback){
	var firstName = query.firstName;
	User.findOne({'firstName': firstName}, function(err, user){
		if (err){
			console.log(err);
			callback(null);
		}
		if (!user){
			console.log("no such user found");
			callback([]);
		} else{
			callback(user);
		}
	});
}
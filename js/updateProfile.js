var User = require('../models/user.js');

module.exports = function(user, body, callback){
	User.findOne({'username': user.username}, 
		function(err, user){
			if (err) {
				console.log(err);
				callback(false);
			}
			if (!user){
				callback(false);
			}
			else{
				user.phoneNum = body.phoneNum;
				user.fbName = body.fbName;
				user.fbUsername = body.fbUsername;
				user.prefEmail = body.prefEmail;
				user.save(function(err){
					if (err) {
						console.log(err);
						callback(false);
					}
					callback(true);
				});
			}
		});
}
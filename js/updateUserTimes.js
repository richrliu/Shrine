var User = require('../models/user.js');

module.exports = function(username, serial, callback){
	User.findOne({'username': username}, 
		function(err, user){
			if (err) {
				console.log(err);
				callback(false);
			}
			if (!user){
				callback(false);
			}
			else{
				var theTimes = user.signedUpTimes;
				if (!theTimes){
					theTimes = [serial];
				} else{
					theTimes.push(serial);
				}
				user.signedUpTimes = theTimes;
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
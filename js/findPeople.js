var LocationTime = require('../models/locationTimes.js');
var User = require('../models/user.js');

module.exports = function(from1, to1, date1, time1, callback){
	LocationTime.findOne({'from': from1, 'to': to1, 'time': time1, 'date': date1}, 
		function(err, locationTime){
			if (err) {
				console.log(err);
				callback(false);
			}
			if (!locationTime){
				callback(false);
			} else{
				var userInfo = [];
				usernames.forEach(function(username){
					User.findOne({'username': username}, function(err, user){
						if (err){
							console.log(err);
							callback(false);
						} else{
							var obj = {
								'username': username,
								'firstName': user.firstName,
								'lastName': user.lastName,
								'email': user.email,
								'phoneNum': user.phoneNum,
								'fbUsername': user.fbUsername,
								'fbName': user.fbName,
								'prefEmail': user.prefEmail
							};
							userInfo.push(obj);
						}
					});
				});
				callback(true, userInfo);
			}
		});
}
var LocationTime = require('../models/locationTimes.js');
var User = require('../models/user.js');

module.exports = function(from1, to1, date1, time1, username1, serial1, callback){
	LocationTime.remove({'from': from1, 'to': to1, 'time': time1, 'date': date1},
		function(err){
			if (err) {
				console.log(err);
				callback(false);
			} else {
				User.findOne({'username': username1}, function(err, user){
					if (err){
						console.log(err);
						callback(false);
					} else{
						// Remove from array
						for (var i=user.signedUpTimes.length-1; i>=0; i--) {
						    if (user.signedUpTimes[i] == serial1) {
						        user.signedUpTimes.splice(i, 1);
						    }
						}
						user.save(function(err){
							if (err){
								console.log(err);
								callback(false);
							} else{
								callback(true);
								console.log("successo");
							}
						});
					}
				});
			}
		});
}
var LocationTime = require('../models/locationTimes.js');

module.exports = function(username, loc, t, d, callback){
	LocationTime.findOne({'location': loc, 'time': t, 'date': d}, 
		function(err, locationTime){
			if (err) {
				console.log(err);
				callback(false);
			}
			if (!locationTime){
				var newLocationTime = new LocationTime();
				newLocationTime.location = loc;
				newLocationTime.time = t;
				newLocationTime.data = "";
				newLocationTime.date = d;
				newLocationTime.usernames = [username];
				newLocationTime.save(function(err){
					if (err) {
						console.log(err);
						callback(false);
					}
					callback(true);
				});
			}
			else{
				users = locationTime.usernames;
				users.push(username);
				// remove duplicates
				users = users.filter(function(elem, pos) {
				    return users.indexOf(elem) == pos;
				});
				locationTime.usernames = users;
				locationTime.save(function(err){
					if (err) {
						console.log(err);
						callback(false);
					}
					callback(true);
				});
			}
		});
}
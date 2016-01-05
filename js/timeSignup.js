var LocationTime = require('../models/locationTimes.js');

module.exports = function(username, from1, to1, t, d, dat, callback){
	LocationTime.findOne({'from': from1, 'to': to1, 'time': t, 'date': d}, 
		function(err, locationTime){
			if (err) {
				console.log(err);
				callback(false);
			}
			if (!locationTime){
				var newLocationTime = new LocationTime();
				newLocationTime.from = from1;
				newLocationTime.to = to1;
				newLocationTime.time = t;
				newLocationTime.data = dat;
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
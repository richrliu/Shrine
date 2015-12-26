var LocationTime = require('../models/locatimeTimes.js');

module.exports = function(username, location, time, callback){
	LocationTime.findOne({'location': location, 'time': time}, 
		function(err, locationTime){
			if (err) {
				console.log(err);
				callback(false);
			}
			if (!locationTime){
				var users = [username];
				var location = location;
				var time = time;
				var data = ''; // fix later
				var newLocationTime = {'location': location, 'time': time, 'data': data, 'usernames': users};
				newLocationTime.save(function(err){
					if (err) {
						console.log(err);
						callback(false);
					}
					callback(true);
				});
			}
			else{
				var users = locationTime.usernames;
				var location = locationTime.location;
				var time = locationTime.time;
				var data = locationTime.data;
				users.push(username);
				// remove duplicates
				users = users.filter(function(elem, pos) {
				    return users.indexOf(elem) == pos;
				});
				locationTime = {'location': location, 'time': time, 'data': data, 'usernames': users};
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
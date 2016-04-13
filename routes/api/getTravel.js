var LocationTime = require('../../models/locationTimes.js');

module.exports = function(query, callback){
	var time = query.time;
	var date = query.date;
	var from = query.from;
	var to = query.to;
	LocationTime.findOne({'from': from, 'to': to, 'time': time, 'date': date}, function(err, locationTime){
		if (err){
			console.log(err);
			callback(null);
		}
		if (!locationTime){
			callback([]);
		} else{
			callback(locationTime.usernames);
		}
	});
}
var express = require('express');
var verify = require('../js/verify.js');
var timeSignup = require('../js/timeSignup.js');
var updateProfile = require('../js/updateProfile.js');
var updateUserTimes = require('../js/updateUserTimes.js');
var findPeople = require('../js/findPeople.js');
var deleteEntry = require('../js/deleteEntry.js');

var API = require('./api');

var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

var redirectIfUnverified = function(req, res, next){
	if (req.user.verified) {
		return next();
	} else{
		res.redirect('/verify');
	}
}

var getFormattedTime = function (time) {
	var hours24 = parseInt(time.substring(0, 2), 10);
	var hours = ((hours24 + 11) % 12) + 1;
	var amPm = hours24 > 11 ? 'pm' : 'am';
	var minutes = parseInt(time.substring(2), 10);
	var min1Str = minutes==0? "00":"30";

	time1 = hours + ':' + min1Str + amPm;

	var carry = minutes+30 >= 60 ? 1 : 0;
	var minStr = (minutes+30)%60==0? "00":"30";
	var hrStr = (hours+carry)%12==0? "12":((hours+carry)%12).toString();
	var amPm2 = ((hours24 + 11) % 12) + 1+carry>11? 'pm':'am';
	time2 = hrStr + ':' + minStr + amPm2;
	return time1 + '-' + time2;
}

module.exports = function(passport){

	/* GET index page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index');
	});

	//Get login page
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	 // GET Registration Page 
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		redirectIfUnverified(req, res, function(){
			res.render('home', { user: req.user });
		});
	});

	router.get('/timeSignup', isAuthenticated, function(req, res){
		redirectIfUnverified(req, res, function(){
			res.render('timeSignup', { user: req.user });
		});
	});

	router.get('/profile', isAuthenticated, function(req, res){
		redirectIfUnverified(req, res, function(){
			res.render('profile', { user: req.user });
		});
	});

	router.post('/profile', function(req, res){
		updateProfile(req.user, req.body, function(success){
			if (!success){
				res.redirect('/profile'); //maybe display error messages
			} else{
				res.redirect('/home');
			}
		});
	});

	router.post('/timeSignup', function(req, res){
		var username = req.user.username;
		var from = req.body.from; 
		var to = req.body.to; 
		var time = req.body.time;
		var month = req.body.month;
		var day = req.body.day;
		var year = req.body.year;
		var date = month+'/'+day+'/'+year;
		var data = req.body.comment;

		var serial = "Date: "+date+", Time: "+time+", From: "+from+", To: "+to+", "+"Time: "+getFormattedTime(time);
		console.log(serial);

		timeSignup(username, from, to, time, date, data, function(success){
			if (success){
				updateUserTimes(username, serial, function(succeed){
					if (succeed){
						res.redirect('/home');
					} else{
						res.redirect('/timeSignup');
					}
				});
			} else{
				res.redirect('/timeSignup');
			}
		});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/verify', function(req, res){
		res.render('verify', {message: req.flash('message') });
	});

	// Handle user verification code
	router.post('/verify', function(req, res){
		var username = req.body.username;
		var password = req.body.password;
		var vint = req.body.verify;
		verify(username, password, vint, function(success, msg){
			if (!success){
				res.render('verify', {message: req.flash('message')});
			} else{
				res.redirect('/home')
			}
		});
	});

	router.get('/findPeople', isAuthenticated, function(req, res){
		redirectIfUnverified(req, res, function(){
			res.render('findPeople', { user: req.user });
		});
	});

	router.post('/findPeople', function(req, res){
		var from = req.body.from.split(": ")[1];
		var to = req.body.to.split(": ")[1];
		var date = req.body.date.split(": ")[1];
		var time = req.body.time.split(": ")[1];
		var timeFormatted = req.body.timeFormatted; 
		var information = {'from': from, 'to': to, 'date': date, 'time': time, 'timeFormatted': timeFormatted};

		findPeople(from, to, date, time, timeFormatted, function(success, userInfo){
			if (!success){
				res.redirect('/home');
			} else{
				res.render('findPeople', {info: userInfo, theInfo: information});
			}
		});
	});

	router.post('/deleteEntry', function(req, res){
		var from = req.body.from.split(": ")[1];
		var to = req.body.to.split(": ")[1];
		var date = req.body.date.split(": ")[1];
		var time = req.body.time.split(": ")[1];
		var timeFormatted = req.body.timeFormatted; 
		var serial = req.body.serial;
		var username = req.user.username;

		deleteEntry(from, to, date, time, username, serial, function(success){
			if (!success){
				res.redirect('/verify');
			} else{
				res.redirect('/home');
			}
		});
	});


	/**
	 *
	 * API METHODS
	 *
	 **/

	 router.get('/api/travel', function(req, res){
	 	var query = req.query;
	 	API.getTravel(query, function(usersList){
	 		//-- LOGIC GOES HERE
	 	});
	 });
	 
	router.get('/api/getUserByFirstName', function(req, res) {
		var query = req.query;
		API.findByFirst(query, function(user) {
			res.render('getUserByFirstName', {user: user});	
		});
	})

	return router;
}




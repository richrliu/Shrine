var express = require('express');
var verify = require('../js/verify.js');
var timeSignup = require('../js/timeSignup.js');
var updateProfile = require('../js/updateProfile.js');
var updateUserTimes = require('../js/updateUserTimes.js');
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
	console.log(req);
	if (req.user.verified) {
		return next();
	} else{
		res.redirect('/verify');
	}
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
		res.render('home', { user: req.user });
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
		var location = req.body.location; // add train station later
		var time = req.body.time;
		var month = req.body.month;
		var day = req.body.day;
		var year = req.body.year;
		var date = month+'/'+day+'/'+year;
		var data = req.body.comment;

		var serial = location+","+date+","+time;

		timeSignup(username, location, time, date, data, function(success){
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

	return router;
}






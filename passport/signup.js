var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        //check if user has edu email
                        var email = req.param('email');
                        User.findOne({'email':email}, function(err, user){
                            if (err) {
                                console.log(err);
                                return done(err);
                            }
                            if (user){
                                console.log('User already exists with email: '+email);
                                return done(null, false, req.flash('message','Email Already Exists'));   
                            } else{
                                var emailSplit = email.split(".");
                                if (emailSplit[emailSplit.length-1] != "edu"){
                                    console.log('Requires a .edu email');
                                    return done(null, false, req.flash('message','Requires a .edu email'));
                                }
                                var temp = emailSplit[emailSplit.length-2];
                                var tempSplit = temp.split("@");
                                var school = tempSplit[tempSplit.length-1];

                                var vint = createHash(username).substring(0,6);
                                // send vint in email here
                                var smtpTransport = nodemailer.createTransport("SMTP",{
                                    service: "Gmail",  // sets automatically host, port and connection security settings
                                    auth: {
                                       user: "richardliu.dev@gmail.com",
                                       pass: "Pattycake1!"
                                    }
                                });
                                smtpTransport.sendMail({  //email options
                                    from: "Richard Liu <richardliu.dev@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
                                    to: "Receiver Name <" + email + ">", // receiver
                                    subject: "Shrine Verification Code", // subject
                                    text: "Thanks for using Shrine! Your verification code is "+vint+". Please verify your account at localhost:3000/verify." // body
                                }, function(error, response){  //callback
                                    if(error){
                                        console.log(error);
                                    } else{
                                       console.log("Message sent: " + response.message);
                                    }
                                   
                                   smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                                });

                                // set the user's local credentials
                                newUser.username = username;
                                newUser.password = createHash(password);
                                newUser.email = email;
                                newUser.firstName = req.param('firstName');
                                newUser.lastName = req.param('lastName');
                                newUser.school = school;
                                newUser.verified = false;
                                newUser.verificationCode = vint;

                                // save the user
                                newUser.save(function(err) {
                                    if (err){
                                        console.log('Error in Saving user: '+err);  
                                        throw err;  
                                    }
                                    console.log('User Registration succesful');    
                                    return done(null, newUser);
                                });
                            }
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
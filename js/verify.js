var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(username, password, vint, callback){

    User.findOne({ 'username' :  username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in Verification: '+err);
            return callback(false);
        }
        if (!user){
            console.log('User Not Found with username '+username);
            return callback(false, 'User Not found.');
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
            console.log('Invalid Password');
            return callback(false, 'Invalid Password'); // redirect back to login page
        }

        console.log(vint);
        if (vint != user.verificationCode){
            return callback(false, 'Incorrect verification code');
        } else{
            user.verified = true;
            user.save(function(err) {
                if (err){
                    console.log('Error in Saving user: '+err);  
                    throw err;  
                }
                console.log('User Verification successful');    
                return callback(true);
            });
        }
    });    

	// passport.use('verify', new LocalStrategy({
 //            passReqToCallback : true // allows us to pass back the entire request to the callback
 //        },
 //        function(req, username, password, done) {

 //            verifyUser = function(){
 //                // find a user in Mongo with provided username
 //                User.findOne({ 'username' :  username }, function(err, user) {
 //                    // In case of any error, return using the done method
 //                    if (err){
 //                        console.log('Error in Verification: '+err);
 //                        return done(err);
 //                    }

 //                    if (!user){
 //                        console.log('User Not Found with username '+username);
 //                        return done(null, false, req.flash('message', 'User Not found.'));                 
 //                    }
 //                    // User exists but wrong password, log the error 
 //                    if (!isValidPassword(user, password)){
 //                        console.log('Invalid Password');
 //                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
 //                    }

 //                    var vint = req.param('verify');
 //                    var vCode = createHash(vint);
 //                    if (vCode != user.verificationCode){
 //                        return done(null, false, req.flash('message','Incorrect verification code'));
 //                    } else{
 //                        user.verified = true;
 //                        user.save(function(err) {
 //                            if (err){
 //                                console.log('Error in Saving user: '+err);  
 //                                throw err;  
 //                            }
 //                            console.log('User Verification successful');    
 //                            return done(null, user);
 //                        });
 //                    }
 //                });
 //            };
 //            // Delay the execution of findOrCreateUser and execute the method
 //            // in the next tick of the event loop
 //            process.nextTick(verifyUser);
 //        })
 //    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

}
module.exports = init;
function init(app) {
  var pkginfo = require('./package');
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

 var DaumStrategy = require('passport-daum').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
  
 
passport.use(new DaumStrategy({
   consumerKey: pkginfo.oauth.daum.DAUM_CONSUMER_KEY,
    consumerSecret: pkginfo.oauth.daum.DAUM_CONSUMER_SECRET,
    callbackURL: pkginfo.oauth.daum.callbackURL
  }, function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }));


    app.get('/auth/daum', passport.authenticate('daum'));

  
   app.get('/auth/daum/callback', passport.authenticate('daum',  {
    successRedirect: '/',
    failureRedirect: '/'
   
  }));
  
  
  
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}
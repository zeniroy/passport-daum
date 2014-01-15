module.exports = init;
function init(app) {
  var pkginfo = require('./package');
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

 var DaumStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
  
 
passport.use(new DaumStrategy({
   consumerKey: pkginfo.oauth.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: pkginfo.oauth.twitter.TWITTER_CONSUMER_SECRET,
    callbackURL: pkginfo.oauth.twitter.callbackURL
  }, function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }));


    app.get('/auth/daum', passport.authenticate('daum'));

  
   app.get('/auth/daum/callback', passport.authenticate('daum',  {
        
    successRedirect: '/',
    failureRedirect: '/'
   
  }));
  
  
  
  app.get('/logout', function(req, res){
    //
    // passport 에서 지원하는 logout 메소드이다.
    // req.session.passport 의 정보를 삭제한다.
    //
    req.logout();
    res.redirect('/');
  });
}
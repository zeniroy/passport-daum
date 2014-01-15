
//if (process.argv[2] == '-h') return console.log('Usage: node ./app.js [port] [process_title]\\ n');
//
// ps on linux
//
console.log(process.env.PORT);
process.title = process.argv[3] || 'nodestatic.com : Static WebServer';
//
// declare
//
var express = require('express'),
    fs = require('fs');
var port = process.env.PORT;
var app = express();
// ------
// !! 아래 부분을 추가하자. ejs 와 session
//
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({
  key    : 'sid',
  secret : 'secret'
}));
// --------
//
// static serving
//
app.use(express.static(__dirname));
//
// **oauth.js** 파일에 OAuth 관련 설정을 하자. app 객체를 전달하자.
//
//require('./oauth_google')(app);
require('./oauth_daum')(app);

app.get('/', function(req, res) {
    console.log(req.session);
  res.render('index', { user: req.session.passport.user || {} });
});


//
// 404 page
//
app.get('*', function(req, res) {
  res.type('html').send(404, fs.readFileSync('404.html'));
});
//
// listen
//
app.listen(port, function() {
  console.log("\x1B[36mStart static server, listen port: " + port + '\x1B[39m')
});
var     OAuth = require('oauth').OAuth,
        read = require('read');

var config = {
        requestTokenUrl: "https://apis.daum.net/oauth/requestToken",
        authorizeUrl: "https://apis.daum.net/oauth/authorize",
        accessTokenUrl: "https://apis.daum.net/oauth/accessToken",
        consumerKey: "5ac75e24-9937-4738-bd7d-e608faf857dd",
        consumerSecret: "FIQfUj__81vSFbSp7p9SiJwFCEFTH.YRXXsDDpIs4PyoIVLr-xenhA00",
        callbackUrl: "oob",
        apiUrl: "https://apis.daum.net"
}

// Service Provider와 통신할 인터페이스를 갖고 있는 객체 생성.
var oauth = new OAuth(config.requestTokenUrl, config.accessTokenUrl,
        config.consumerKey, config.consumerSecret,
        "1.0", config.callbackUrl, "HMAC-SHA1");

// 2. Request Token 요청
oauth.getOAuthRequestToken(function(err, requestToken, requestTokenSecret, results) {
        if (err) {
                console.log(err);
        } else {

                // 3. 사용자 인증(Authentication) 및 권한 위임(Authorization)
                console.log(config.authorizeUrl + "?oauth_token=" + requestToken);
                console.log("requestTokenSecret : " + requestTokenSecret);
                console.log("웹브라우저에서 위 URL로 가서 인증코드를 얻고 입력하세요.");

                // 4. verifier 입력 받기
                read({prompt: "verifier: "}, function(err, verifier) {
                        if(err) {
                                console.log(err);
                        } else {

                                // 5. Request Token을 AccessToken 으로 교환
                                oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, function(err, accessToken, accessTokenSecret, result) {
                                        if (err) {
                                                console.log(err);
                                        } else {

                                                console.log("requestToken = " + requestToken);
                                                console.log("requestTokenSecret = " + requestTokenSecret);
                                                console.log("Access Token = " + accessToken);
                                                console.log("Access Token Secret = " + accessTokenSecret);


                                                var resourceUrl = "https://apis.daum.net/profile/show.json";
                                                oauth.get(resourceUrl, accessToken, accessTokenSecret, function(err, data, res) {
                                                        if(err) {
                                                                console.log(err);
                                                        } else {
                                                               

                                                                console.log(data);
                                                        } 
                                                });
                                               
                                        }
                                });
                        }
                });
        }
});
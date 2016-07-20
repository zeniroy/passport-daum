// Load modules.
var OAuth2Strategy = require('passport-oauth2'),
    uri = require('url'),
    Profile2 = require('./profile2'),
    util = require('util'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;


function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://apis.daum.net/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://apis.daum.net/oauth2/token';
    OAuth2Strategy.call(this, options, verify);

    this.name = 'daum';
    this._profileURL = options.profileURL || 'https://apis.daum.net/user/v1/show.json';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.authenticate = function (req, options) {
    if (req.query && req.query.error_code && !req.query.error) {
        return this.error(new FacebookAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
    }

    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

Strategy.prototype.authorizationParams = function (options) {
    return {};
};

Strategy.prototype.userProfile = function (accessToken, done) {
    var url = uri.parse(this._profileURL);
    url = uri.format(url);

    this._oauth2.get(url, accessToken, function (err, body, res) {
        var json;

        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                } catch (_) {
                }
            }

            if (json && json.error && typeof json.error == 'object') {
                return done(new Error("error on api: " + JSON.stringify(err)));
            }
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = Profile2.parse(json);
        profile.provider = 'daum';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
};


Strategy.prototype.parseErrorResponse = function (body, status) {
    var json = JSON.parse(body);
    if (json.error && typeof json.error == 'object') {
        return new FacebookTokenError(json.error.message, json.error.type, json.error.code, json.error.error_subcode, json.error.fbtrace_id);
    }
    return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};

// Expose constructor.
module.exports = Strategy;

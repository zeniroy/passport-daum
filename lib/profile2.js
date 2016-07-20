
exports.parse = function(json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    var profile = {};
    profile.id = String(json.result.id);
    profile.username = json.result.userid;
    profile.displayName = json.result.nickname;
    profile.photos = [{ value: json.result.bigImagePath }];

    return profile;
};

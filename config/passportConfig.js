const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const ENV_VAR = require("./../config/environmentVariable");

const passportConfig = () => {
    passport.use(
        new GitHubStrategy(
            {
                clientID: ENV_VAR.GITHUB_CLIENT_ID,
                clientSecret: ENV_VAR.GITHUB_CLIENT_SECRET,
                callbackURL: ENV_VAR.GITHUB_CALLBACK_URL,
            },
            (accessToken, refreshToken, profile, cb) => {
                return cb(null, profile);
            },
        ),
    );
};

module.exports = passportConfig;

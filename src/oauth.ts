const googleS = require('passport-google-oauth20');
const lcl = require('passport-local');
const pass = require('passport');
pass.use(new googleS({
        callbackURL: '/auth/google/redirect',
        clientID: process.env.SEC1,
        clientSecret: process.env.SEC2
}, (accessToken, refreshToken, profile, done) => {
        console.log('Profile: ', profile)

}))
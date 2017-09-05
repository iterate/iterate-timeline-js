'use strict';

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const ROOT_URL = IS_DEVELOPMENT ? 'http://localhost:5000' : 'https://iterate-timeline.app.iterate.no';

function extractProfile(profile) {
  return {
    id: profile.id,
    displayName: profile.displayName
  }
}

passport.use(new GoogleStrategy({
  clientID: "299640317993-nbkaetl2fh9d6m6srestqgkeuut1t8om.apps.googleusercontent.com",
  clientSecret: "0WBi9bDqatsoCh3fRY4YmUdL",
  callbackURL: ROOT_URL + "/auth/callback",
}, (accessToken, refreshToken, profile, cb) => {
  if (profile._json.domain === "iterate.no") {
    process.nextTick(() => {
      return cb(null, profile);
    })
  } else {
    cb(new Error("Kun for personer med @iterate.no-domene"));
  }

}));

passport.serializeUser((user, cb) => {
  cb(null, user.id)
});

passport.deserializeUser((id, cb) => {
  cb(null, id)
});

const router = express.Router();

function authRequired(req, res, next) {
  if (IS_DEVELOPMENT) {
    next();
    return;
  }

  if (!req.user) {
    return res.redirect('/auth/login');
  }

  next();
}

router.get(
  '/auth/login',
  passport.authenticate('google', { scope:
    ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }),
  (req, res) => {}
);

router.get(
  '/auth/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login'}),
  (req, res) => {
    res.redirect('/');
  }
);

router.get(
  '/auth/logout',
  (req, res) => {
    req.logout();
    res.redirect('/auth/login');
  }
);


module.exports = {
  extractProfile: extractProfile,
  router: router,
  authRequired: authRequired
};

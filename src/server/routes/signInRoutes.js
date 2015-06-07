'use strict';

import express from 'express';
import passport from 'passport';
import UserRepository from '../repos/store/UserRepository.js';
import SessionRepository from '../repos/store/SessionRepository.js';
import RandomizerService from '../services/RandomizerService.js';

var router = express.Router();

router.get('/connect', passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login'] }));


router.get('/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    if (user === null) {
      res.redirect('/error');
    } else {
      var sessionRepo = new SessionRepository();
      sessionRepo.createSession(user, info.providerToken)
        .then(function(session){
          res.render('index', {
                                  sessionToken: session.base_access_token,
                                  sessionEmail: session.email_address
                              });
        });
    }
  })(req, res, next);
});

module.exports = router;

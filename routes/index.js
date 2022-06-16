const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');

function isLoggedOut(req,res,next){
  if(!req.isAuthenticated()) return next();
  res.redirect('/');
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/', (req, res) => {
  res.render('index', {title: 'Passport Demo EJS' });
});

router.get("/login", isLoggedOut, (req, res) => res.render("login"));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.clearCookie('connect.sid')
    res.redirect('/');
  });
});

router.get("/protected", isLoggedIn, (req, res) => res.render("protected"));

router.get("/register", isLoggedOut, (req, res) => res.render("register"));

router.post("/register", isLoggedOut, (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const user = new UserModel({
          username: req.body.username,
          password: hashedPassword
        }).save(err => {
          if (err) { 
            return next(err);
          }
          res.redirect("/protected");
        });
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/"
  })
);

module.exports = router;
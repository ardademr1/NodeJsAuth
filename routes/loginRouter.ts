let router2 = require('express').Router(); 

let ctrlLogin = require('../controller/loginController');

import bodyParser from 'body-parser';
const {pool} = require("../dbConfig");
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("../passportConfig");

router2.use(bodyParser.urlencoded({ extended:true }));
        router2.use(bodyParser.json({ limit: '1mb' })); // 100kb varsayılan
        router2.use(express.json());
        router2.use(passport.initialize());
        router2.use(passport.session());
        router2.use(express.urlencoded({extended: false}));

/*router2.route("/login",checkAuthenticated)
      .get(ctrlLogin.login_get);*/
router2.get("/login",checkAuthenticated,(req,res)=>{
        console.log(req.session.flash.error);
        res.render("login.ejs");
      });



router2.post("/login",passport.authenticate("local",{
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true
}));
//router2.post(ctrlLogin.login_post);
function checkAuthenticated(req, res, next) {
      console.log(req.isAuthenticated());
      if (req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
      }
      next();
    }

    function checkNotAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect("/users/login");;
    }

module.exports = router2
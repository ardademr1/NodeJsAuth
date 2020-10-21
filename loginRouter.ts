let router2 = require('express').Router(); 

let ctrlLogin = require('../controller/loginController');

import bodyParser from 'body-parser';
const {pool} = require("../dbConfig");
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const checkAuthenticated = require("../middleware/checkAuthenticated");

        router2.use(passport.initialize());
        router2.use(passport.session());

/*router2.route("/login",checkAuthenticated)
      .get(ctrlLogin.login_get);*/
router2.get("/login",checkAuthenticated,(req,res)=>{
        //console.log(req.session.flash.error);
        res.json({ error:{},code: req.isAuthenticated(),message: "Lütfen Giriş Yapın",token:{} });
        //res.render("login.ejs");
      });



router2.post("/login",passport.authenticate("local",{
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true
}));
//router2.post(ctrlLogin.login_post);


module.exports = router2
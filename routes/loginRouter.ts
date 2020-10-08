let router2 = require('express').Router(); 

let ctrlLogin = require('../controller/loginController');

router2.route("/login")
      .get((req,res)=>{
        res.render("login.ejs");
      }).post();

module.exports = router2
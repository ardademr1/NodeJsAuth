let router2 = require('express').Router(); 

let ctrlLogin = require('../controller/loginController');

router2.route("/login")
      .get(ctrlLogin.index)

module.exports = router2
let router2 = require('express').Router(); 

let ctrlLogin = require('../controller/loginController');

router2.route("/login")
      .get(ctrlLogin.index);

router2.post(ctrlLogin.login_post);

module.exports = router2
let router3 = require('express').Router(); 

let ctrlHome = require('../controller/homeController');

//Gösterge Paneli sayfası İstekde Bulununca;
router3.get("/users/dashboard",ctrlHome.dashboard);

//Ana sayfaya İstekde Bulununca;
router3.route("/")
      .get(ctrlHome.index).post();

module.exports = router3
const router = require('express').Router(); 
require("dotenv").config();

let ctrlRegister = require('../controller/registerController');

router.route("/register")
      .get(ctrlRegister.index);

/*router.post('/register',async (req,res)=>{ //veritabanı kaydetme
          
      });*/
    module.exports = router;
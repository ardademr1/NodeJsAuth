export {};
const router = require('express').Router(); 

let ctrlRegister = require('../controller/registerController');
const {pool} = require("../dbConfig");
const bcrypt = require("bcrypt");

/*router.route("/register")
      .get(ctrlRegister.index);*/
router.get("/register", checkAuthenticated, (req, res) => {
            res.render("register.ejs");
          });


//Veri tabanına Kayıt Eklemek
router.post('/register',async (req,res)=>{
      let {name, email, password, password2} =req.body;

      console.log({
          name,
          email,
          password,
          password2
      });

      let errors=[];

      if(!name||!email||!password||!password2){
          errors.push({message: "Tüm Alanları Doldurun"});
      }
      if(password.length <6){
          errors.push({message: "Şifre 6 Karakterde Az Olamaz"});
      }
      if(password != password2){
          errors.push({message: "Şifreler Farklı"});
      }
      if(errors.length>0){
          res.render("register",{errors});
      }else{
          // kayıt olma başarılı
          let hashedPassword = await bcrypt.hash(password, 10);
          console.log(hashedPassword);

          pool.query(
              `SELECT * FROM users
                WHERE email = $1`,
              [email],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                if (results.rows.length > 0) {
                  return res.render("register", {
                    message: "Email Çoktan Alınmış."
                  });
                } else {
                  pool.query(
                    `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`,
                    [name, email, hashedPassword],
                    (err, results) => {
                      if (err) {
                        throw err;
                      }
                      console.log(results.rows);
                      res.json("Kayıt Başarılı");
                      //res.redirect("/users/login");
                    }
                  );
                }
              }
          );

      }
  });
  /*

/*router.post('/register',async (req,res)=>{ //veritabanı kaydetme
          
      });*/
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


module.exports = router;
import express = require('express');
import { NumberLiteralType } from 'typescript';
import HttpException from './exceptions/HttpException';
require("dotenv").config();
// Create a new express app instance
const app: express.Application = express();
const passport = require("passport");
const {pool} = require("./dbConfig");
const initializePassport = require("./passportConfig");
const bcrypt = require("bcrypt");
import errorMiddleware from './middleware/error.middleware';
initializePassport(passport);

const PORT = process.env.PORT || 3000;

require('./routes/routeManager')(app);

app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}));
app.use(errorMiddleware);

//Ana sayfaya İstekde Bulununca;

/*app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});*/

/*app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  //console.log(req.session.flash.error);
  let {email, password} =req.body;
  console.log(req.body)
  res.render("login.ejs");
});*/

app.get("/users/logout", (req, res) => {
  //req.logout();
  res.render("index", { message: "You have logged out successfully" });
});

//Veri tabanına Kayıt Eklemek
app.post('/users/register',async (req,res)=>{
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
                    res.redirect("/users/login");
                  }
                );
              }
            }
        );

    }
});
/*
//Admin sayfasına İstekde Bulununca;
app.get('/admin',function(request,response){
    response.send('admin');             
})

//Post: veri eklemek, güncellemek veya silmek için post an faydalınır.
app.post('/admin',function(request,response){
    response.send('admin post isteği alındı');             
})

//delete:
app.delete('/admin',function(request,response){
    response.send('admin delete isteği alındı');             
})*/

app.post("/users/login",passport.authenticate("local",{
  successRedirect: "/users/dashboard",
  failureRedirect: "/users/login",
  failureFlash: true
}))

function checkAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next(new HttpException(404, 'Kullanıcı Girişi Yapılı'));
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(new HttpException(404, 'Kullanıcı Giriş Yapmadı'));
  }
  res.redirect("/users/login");;
}

app.listen(PORT,()=>{
    console.log('Server Çalışıyor... port=' + PORT);
});




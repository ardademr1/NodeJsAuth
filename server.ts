
import bodyParser from 'body-parser';
const {pool} = require("./dbConfig");
const express = require("express");
const app = express();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import errorMiddleware from './middleware/error.middleware';
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passportConfig");

initializePassport(passport);

class Server {
    private app;

    constructor() { //nesne oluşturulduğunda çağrılan metot
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
        this.app.set('view engine','ejs');
        this.app.use(express.json());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(errorMiddleware);

        //Ana sayfaya İstekde Bulununca;

        // Parses details from a form
        this.app.use(express.urlencoded({ extended: false }));
        this.app.set("view engine", "ejs");

        this.app.use(session({
          secret: 'secretidhere', 
          resave: false, 
          saveUninitialized: false
        }))
        // Pasaportu başlatan fonksiyon
        this.app.use(passport.initialize());
        // Değişkenlerimizi tüm oturum boyunca kalıcı olacak şekilde saklayın. Yukarıdaki app.use (Session) ile çalışır
        this.app.use(passport.session());
        this.app.use(flash());

        this.app.get("/", (req, res) => {
          res.render("index");
        });

        this.app.get("/users/register", checkAuthenticated, (req, res) => {
          res.render("register.ejs");
        });

        this.app.get("/users/login", checkAuthenticated, (req, res) => {
          // passport error mesajı üretir.
          console.log(req.session.flash.error);
          res.render("login.ejs");
        });

        this.app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
          console.log(req.isAuthenticated());
          res.render("dashboard", { user: req.user.name });
        });

        this.app.get("/users/logout", (req, res) => {
          req.logout();
          res.render("login", { message: "Başarıyla Çıkış Yapıldı!" });
        });

        //Veri tabanına Kayıt Eklemek
        this.app.post('/users/register',async (req,res)=>{
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
      this.app.post(
        "/users/login",
        passport.authenticate("local", {
          successRedirect: "/users/dashboard",
          failureRedirect: "/users/login",
          failureFlash: true
        })
      );


      this.app.post("/users/login",passport.authenticate("local",{
        successRedirect: "/users/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
      }));


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
    }

    private dbConnect() {
        pool.connect(function (err, client, done) {
            if (err) throw new Error(err);
            console.log('Veri Tabanına Bağlanıldı.');
          }); 
    }

    private routerConfig() {
      //require('./routes/routeManager')(app);
    }
    
    private initializeErrorHandling() {
      this.app.use(errorMiddleware);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;


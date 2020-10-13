
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
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb varsayılan
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
          secret: process.env.SECRET_SESSION || 'secretidhere', 
          resave: false, 
          saveUninitialized: false
        }))
        // Pasaportu başlatan fonksiyon
        this.app.use(passport.initialize());
        // Değişkenlerimizi tüm oturum boyunca kalıcı olacak şekilde saklayın. Yukarıdaki app.use (Session) ile çalışır
        this.app.use(passport.session());
        this.app.use(flash());
        

        this.app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
          console.log(req.isAuthenticated());
          res.render("dashboard", { user: req.user.name });
        });

        this.app.get("/users/logout", (req, res) => {
          req.logout();
          res.render("login", { message: "Başarıyla Çıkış Yapıldı!" });
        });

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
      require('./routes/routeManager')(this.app);
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


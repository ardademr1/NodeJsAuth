
import bodyParser from 'body-parser';
const {pool} = require("./dbConfig");
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import errorMiddleware from './middleware/error.middleware';
import flash from 'express-flash';
import session from 'express-session';
import HttpException from "./exceptions/HttpException";
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
          res.json({ error: "false",code: req.isAuthenticated(),message: "Login Successful",token:{},user:{id: req.user.id, isim: req.user.name }});
          //res.json({ msg: `Hoşgeldin ${req.user.name}!` });
          //res.render("dashboard", { user: req.user.name });
        });

        this.app.get("/users/logout", (req, res) => {
          req.logout();
          res.json({ message: "Başarıyla Çıkış Yapıldı!" });
          //res.render("login", { message: "Başarıyla Çıkış Yapıldı!" });
        });

      function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.status(401).send({message: "Yetkisiz Giriş"});
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


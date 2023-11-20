import express from "express";
import ejs from "ejs";
import gamernamer from "gamer-namer";
import body_parser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import passport_local_mongoose from "passport-local-mongoose";


var randomPlayerName = gamernamer.generateName();

const port = 3000;

const app = express();

app.use(express.static("public"));

app.use(body_parser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'Lenovo.',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passport_local_mongoose);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Metodo para renderizar la pagina de register
app.get("/", (req, res) =>{
    if(req.isAuthenticated()){
        res.render("index.ejs");
    }
    else{
        res.redirect("register");
    }
});

app.get("/register", function(req,res){
    res.render("register.ejs");
});

//Metodo para renderizar la pagina de login
app.get("/login", function(req,res){
    res.render("login");
});

//Metodo para guardar la informacion de los usuarios al ingresar sus datos
app.post("/register", function(req,res){
    User.register({email:req.body.username}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect("register");
         }
         else{
            passport.authenticate('local') (req, res, function(){ 
                res.redirect('/');
            });
         }
    });
});

//Metodo para enviarlos a la pagina principal una vez se hayan logeado
app.post("login", function(req,res){
    const user = new User({
        email: String,
        password: String
    });

    req.login(user, function(err) {
        if (err) 
        { 
            return next(err); 
        }
        else{
                passport.authenticate('local') (req, res, function(){ 
                    res.redirect('/');
                });
        }
      });
});

app.listen(port, () =>{
    console.log("hola mundo");
});

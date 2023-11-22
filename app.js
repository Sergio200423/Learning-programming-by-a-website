import express from "express";
import ejs from "ejs";
import gamernamer from "gamer-namer";
import body_parser from "body-parser";
import passport from "passport";
import session from "express-session";
import pg from "pg";
import nodemailer from "nodemailer";

var randomPlayerName = gamernamer.generateName();

const port = 3000;

const app = express();
 
app.use(express.static("public"));

app.use(body_parser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'sergiodanielxd2004@gmail.com',
    pass: 'xzdb vffr pbcb dbfz'
  }
});

const db = new pg.Client({
    "user": "postgres",
    "host": "localhost",
    "database": "LearningHowtoCode",
    "password": "123456",
    "port": 5432
});

db.connect();



app.get("/", (req, res) =>{
   
    res.render("index.ejs");
});

app.get("/register", function(req,res){
    res.render("register.ejs");
});

//Metodo para renderizar la pagina de login
app.get("/login", function(req,res){
    res.render("login");
});

app.get("/home", (req,res) =>{
    res.render("home.ejs");
});

//Metodo para guardar la informacion de los usuarios al ingresar sus datos
app.post("/register", async function(req,res){
    const carnetIngresado = req.body.carnet;
    const usuarioEncontrado = await db.query("SELECT contra FROM usuario where carnet = $1", [carnetIngresado]);

    if(usuarioEncontrado.rows.length == 0)
    {
        const nombreUsuario = req.body.nombreUsuario;
        const contra = req.body.contra;
        const correo = req.body.correo;
        await db.query("INSERT INTO usuario(carnet, nombreUsuario, correo, contra) VALUES($1, $2, $3, $4)", [carnetIngresado, nombreUsuario, correo, contra]);

        const mailOptions = {
        from: 'sergiodanielxd2004@gmail.com',
        to: correo,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        // res.render("home.ejs");
        }
        });

    }
    
    else{
        document.alert("El usuario que ingreso ya ha sido registrado. Inicie sesion");
        res.redirect("/login");
    }

    
});

//Metodo para enviarlos a la pagina principal una vez se hayan logeado
app.post("/login", async function(req,res){
    const carnetIngresado = req.body["carnet"];
    const contraIngresada = req.body["contra"];

    const resultado = await db.query("SELECT contra FROM usuario where carnet = $1", [carnetIngresado]);
    if(resultado.rows.length != 0)
    {
        const contraBaseDatos = resultado.rows[0];

        if(contraBaseDatos['contra'] === contraIngresada)
        {
            res.render("index.ejs");
        }

        else{
            res.redirect("/login");
        }
    }
    else{
        res.redirect("/login");
    }
    
});

app.listen(port, () =>{
    console.log("hola mundo");
});

import express from "express";
import ejs from "ejs";
import gamernamer from "gamer-namer";
import body_parser from "body-parser";
import bcrypt from "bcrypt";

var randomPlayerName = gamernamer.generateName();

const app = express();

const saltRound = 12;

const port = 3000;

app.use(express.static("public"));

app.use(body_parser.urlencoded({
    extended: true
}));

app.get("/", (req, res) =>{
    res.render("register.ejs")
});

app.post("/register", function(req,res){
    bcrypt.hash(req.body_parser.password, saltRound, function(err,has)
    {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err)
        {
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
    //renderizar pagina
    res.render("register.ejs");
});
app.listen(port, () =>{
    console.log("hola mundo");
});

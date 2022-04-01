//jshint esversion:6

const express = require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const session= require('express-session');
const passport= require('passport');
const passportLocalMongoose= require("passport-local-mongoose");
var alert = require("alert");

const app= express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret:"Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

let login = "Sign in";

const userSchema= new mongoose.Schema({
    username: {
        type: String
        // required: true
    },
    frontname: {
       type: String
    },
    rollNo: {
      type: Number
    },
    password: {
        type: String
        // required: true
    }
});
userSchema.plugin(passportLocalMongoose);

const  User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const answerSchema ={
    answer: String,
    user: String
};
const querySchema ={
    user: String,
    query: String,
    answers: [answerSchema]
};
const Answer= mongoose.model("Answer",answerSchema);
const Query = mongoose.model("Query",querySchema);
app.post("/Queries",function(req,res){
    const newQuery= req.body.queryname;
    const newQueryFull= new Query ({
        user:req.user.username,
        query: newQuery,
        answers: []
    });
    newQueryFull.save();
    res.redirect("/Queries");
});
app.get("/Queries",function(req,res){
  let getAllQuery=[];
  Query.find({},function(err,allQuery){
    if(err){
      console.log(err);
    }else{
      getAllQuery=allQuery;
    }
  });
  if(req.isAuthenticated()){
    Query.find({user:req.user.username}, function(err, foundQuery){
        if(err){
            console.log(err);
        }else{
            res.render("queries", {queryList: foundQuery, login: login,queryLatestList: getAllQuery});
        }
    });
  }else{
    res.render("queries",{queryList: [], login: login,queryLatestList: getAllQuery});
  }
});
app.post("/Answer",function(req,res){
  const newAnswer=new Answer({
    user:req.user.frontname,
    answer:req.body.answerArea
  });
  console.log(req.user.frontname);
  Query.findOneAndUpdate({_id:req.body.queryId},{$push:{answers:newAnswer}},function(error,success){
    if(error){
      console.log(error);
    }else{
      console.log(success);
    }
  });
  newAnswer.save();
  res.redirect('/Queries');
});

app.get("/login",function(req,res){
  if(req.isAuthenticated()){
    res.redirect('/');
  }else{
    res.render("login");
  }
});
app.post("/login",function(req,res,next){
  let foundfrontname='a';
  User.findOne({username: req.body.username}, function(err, foundUser){
    if(err){
      res.redirect('/login');
    }else{
      if(foundUser){
        foundfrontname=foundUser.frontname;
      } 
    }
  });
  const user= new User({
    username: req.body.username,
    password: req.body.password
  });
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      alert("Invalid username or password");
      return res.redirect('/login'); 
    }
    req.login(user, function(err) {
      if (err) { 
        return next(err); 
      }else{
        login=foundfrontname;
        return res.redirect('/');
      }
    });
  })(req,res,next);
});

app.get('/logout', function(req, res){
  req.logout();
  login="Sign in";
  res.redirect('/');
});

app.get("/signup",function(req,res){
  if(req.isAuthenticated()){
    res.redirect('/');
  }else{
    res.render("signup");
  } 
});
app.post("/signup",function(req,res){
  const newUser=new User({
    username:req.body.username,
    frontname: req.body.frontname,
    rollNo: req.body.rollnumber
  });
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      alert("User already exists.");
      res.redirect("/signup");
    }else{
      passport.authenticate('local')(req,res,function(){
        login=newUser.frontname;
        res.redirect('/');
      });
    }
  });
});

app.get("/socities",function(req,res){
    res.render("socities", {login: login});
});

app.get("/resources",function(req,res){
    res.render("resources", {login: login});
});

app.get("/",function(req,res){
    res.render("index",{login: login});
    
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});

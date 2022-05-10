import express from 'express'
import fileStrategy from "session-file-store"
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport"
import {Strategy} from "passport-local"
import User from "../models/User.js"
import bCrypt from "bcrypt"



const router = express.Router()
passport.serializeUser((user,done)=>{
  return done (null, user.id)
})
passport.deserializeUser((id, done)=>{
  User.findById(id,(err,user)=>{
      return done(err,user)
  })
})
function createHash(password) {
  return bCrypt.hashSync(
            password,
            bCrypt.genSaltSync(10),
            null);
}
function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
 }
 

passport.use('registro', new Strategy(
  {
      passReqToCallback: true
  },
  (req,username,password,done)=>{
      User.findOne({username:username},(err,user)=>{
          if(err) return done(err)
          if(user) return done(null, false, {message:"user already exists"});
          const newUser = {
              name: req.body.name,
              username: username,
              password: createHash(password),
          }
          User.create(newUser, (err,userCreated)=>{
              if(err) return done(err);
              return done(null,userCreated)
          })
      })
  }
))
passport.use('login', new Strategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err)
        return done(err);
 
      if (!user) {
        console.log('User Not Found with username ' + username);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log('Invalid Password');
        return done(null, false);
      }
 
      return done(null, user);
    });
  })
 );
 
//login

router.get("/login", (req, res) => {
  if(req.isAuthenticated()){
    let user = {userName:req.user.name}
    console.log(user)
    console.log("user logged")
    res.render("index", user)
  
  }else{res.render("login")}
})
router.post("/login",passport.authenticate("login",{
  failureRedirect:"/loginErr",
}), (req, res) => {
  let user = {userName:req.user.name}
  console.log(user)
res.render("index",user)
})
router.get("/loginErr",(req,res)=>{
res.render("loginErr")
})

//logout

router.get("/logout", (req, res) => {
  var res_body={userName:req.user.name}
  req.session.destroy()
    res.render("logout",res_body);
  })

  
//signup

router.get("/signup",(req,res)=>{
res.render("signup")
})
router.post("/signup",passport.authenticate("registro",{
  failureRedirect: '/signupErr',
}) ,(req,res)=>{
    res.redirect("/login")
})


router.get("/signupErr",(req,res)=>{
  res.render("signupErr")
})




export default router
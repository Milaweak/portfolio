const express = require("express");
const UserModel = require("../models/user");
const authGuard = require("../services/authGuard");
const userRouter = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;

require('dotenv').config()

const transporter = nodemailer.createTransport({        
  service: "Outlook365",
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {rejectUnauthorized: false}
})





/********* bcrypt *********/
let cryptPassword = async function (password) {
  //permet de crypter une chaine de caractere
  let salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

let comparePassword = async function (plainPass, hashword) {
  //permet de comparer une chaine de caractere en clair et une autre crypté
  let compare = bcrypt.compare(plainPass, hashword);
  return compare;
};

userRouter.get("/", (req, res) => {
  res.render("index.twig");
});

userRouter.get("/login", async (req, res) => {
  res.render("./connect.twig");
});

/********* User Connect *********/
userRouter.post("/login", async (req, res) => {
  let user = await UserModel.findOne({ username: req.body.username });
  if (user) {
    if (await comparePassword(req.body.password, user.password)) {
      req.session.userId = user._id;
      console.log("successfully logged");
      res.redirect("/addproject");
    }
  } else {
    console.log("not logged");
    res.redirect("/");
  }
});

userRouter.get("/addproject", authGuard, async (req, res) => {
  res.render("./addproject.twig");
});

userRouter.get("/logout", authGuard, async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/********* Page Form register *********/

userRouter.get("/formRegister", async (req, res) => {
  res.render("./formRegister.twig");
});

userRouter.post("/formRegister", async (req, res) => {
  try {
    req.body.password = await cryptPassword(req.body.password);
    let user = new UserModel(req.body);
    await user.save();
    console.log(user);
    req.session.user = user._id;
    res.redirect("/login");
  } catch (error) {
    res.send(error);
  }
});


userRouter.post('/sendMail', async (req, res) =>{
  try{
     console.log(req.body);
     let info = await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: process.env.MAIL_RECEIVE,
        subject: req.body.name,
        html: JSON.stringify(req.body),
     })
     res.redirect('/')
  }catch (err){
     console.log(err);
     res.send(err)
  }
})







module.exports = userRouter;
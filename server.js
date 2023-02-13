const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
const app = express();
const userRouter = require ('./routes/userRouter.js')

require('dotenv').config()

mongoose.set('strictQuery', false);
const db = process.env.BDD_URL
mongoose.connect(db)

app.use(express.static('assets'))
app.use(session({secret: "secret", saveUninitialized: true,resave: true}));
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(userRouter)


app.listen(3000,(err)=> {
    if (err) {
    console.log(err);}
    else{
    console.log('Je suis connecté');
    }
    })

mongoose.set('strictQuery', false);
mongoose.connect(db, (err)=> {
    if (err)
 {
console.log(err);
 }else {
    console.log("Connected to DataBase");
 }})

 
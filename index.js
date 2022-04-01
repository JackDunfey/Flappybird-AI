const express = require('express');
const path = require('path');
const Datastore = require('nedb')
// const bcrypt = require('bcrypt');
require('dotenv/config');

const db = new Datastore({filename: "data.db", autoload: true});
const app = express();
const port = process.env.PORT || 80;
const host = process.env.HOST || "localhost"
const server = app.listen(port,host,()=>{
console.log(`Server started on ${host}:${port} at ${new Date().toString()}`);
});
app.use('/static',express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "pug")
app.get('/',(req,res)=>{
    res.render("index")
});
app.get('/configure',(req,res)=>{
    res.sendFile(`${path.resolve()}/sites/setting.html`);
})
app.post('/configure',(req,res)=>{
    db.find({name:req.body.name},(err,databaseArray)=>{
        if(err) res.sendStatus(500);
        if(databaseArray.length >= 1){
            res.redirect('//localhost/configure?rename=true');
        } else {
            db.insert(req.body);
            res.end();
        }
    });
});

app.get('/temp',(req,res)=>{
  res.sendFile(`${path.resolve()}/sites/temp.html`);
})

const express=require("express");
const path=require("path");
const app=express();
const {PORT=3000}=process.env;

app.use(express.static(path.join(__dirname,'public')));
//app.get('*', function(req, res) {
    
    //res.sendFile(__dirname+'/public/index.html');
//});

app.listen(PORT, ()=>console.log('server started!!!'+__dirname));
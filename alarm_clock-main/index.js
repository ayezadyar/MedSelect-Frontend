const express = require('express');
const PORT = process.env.PORT || 8000;

const path = require('path');

const app = express();

app.use(express.static('./assets'));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',function(req,res){
    return res.render('alarm');
});

app.listen(PORT,function(err){
    if(err){
        console.log("Error in starting server",err);
        return;
    }
    console.log('Server is up and running on port',PORT);
});
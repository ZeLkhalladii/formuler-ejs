const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));

// accept url encoded
app.use(bodyParser.urlencoded({extended: true}));

// accept json 
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.set('views', 'views');

// ======== Connected NodeJS via MySQL========
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'formejs'
});

conn.connect(function(error){
    if(!!error) console.log(error);
    else  console.log('Connected! :)')
}); 


// 

app.get('/', (req, res, next) => {
    const sql = "SELECT * FROM form";
    const query = conn.query(sql, (err, rows) => {
        if(err)throw err;
            res.render('index', {
                authors : rows
            });
                
    })
})


// ========== ADd new==========
app.get('/add',(req, res) => {
    res.render('addPage');
});
   
app.post('/save',(req, res) => { 
    const data = {
        name: req.body.name, 
        description: req.body.description,
        image : req.body.image,
        title : req.body.title
    };
    const sql = "INSERT INTO form SET ?";
    const query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


//======= EDIT QUOTE =========
app.get('/edit/:userId',(req, res) => {
    const authorId = req.params.userId;
    let sql = `Select * from form where id = ${authorId}`;
    let query = conn.query(sql,(err, result) => {
        if(err) throw err;
        res.render('editPage', {
            author : result[0]
        });
    });
});

app.post('/update',(req, res) => {
  
    let userId = req.body.id

    let sql = "Update form SET name='"+req.body.name+"', description='"+req.body.description+"', title='"+req.body.title+"', image='"+req.body.image+"' where id ="+userId;
    let query = conn.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//======= DELETE QUOTE =========
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from form where id = ${userId}`;
    let query = conn.query(sql,(err, result) => {
        if(err)
         throw err;
        res.redirect('/');
    });
});


//  Listing Server 
app.listen(8000, () => {
    console.log('server is rinning')
});
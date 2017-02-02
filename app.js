var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var scraper = require('google-search-scraper');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var index = require('./routes/index');
var users = require('./routes/users');
var mongodb = require('mongodb');
var jsonfile = require('jsonfile')


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.get('/api', function(req, res) {
  var val = req.param('query');
  var site = req.param('site');
  
  var sample =[]
  var options =
   {
       query: 'site:https://'+ site +'/ ' + val,
       limit: 10
    };
   var col =[]

  scraper.search(options, function(err, url) 
  {
    // This is called for each result 
    if(err) throw err;
     console.log(url)

        col.push(url)
    fs.writeFile('helloworld.json', col, function (err) {
    if (err) 
        return console.log(err);
    console.log('Hello World > helloworld.txt');
    });
  });

fs.readFile('helloworld.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  res.json(data)
  ///console.log(data);
});

   // mango=stringify(sample,null,4)
    // res.send(mango);
   






  // res.send(user_id + ' ' + token + ' ' + geo);
});



app.use('/users', users);
// app.get('/searching', function(req, res){
//  // input value from search
// var sample = new Array();
// var val = req.query.search;
// console.log(val);

//  var options = {
//   query: 'site:https://www.daraz.pk/ '+ val,
//   limit: 10
// };

// scraper.search(options, function(err, url) {
//   // This is called for each result 
//   if(err) throw err;
//     console.log(url)


//   if (url.endsWith(".html"))
//   {



//   /////////////patch  URL scrapper /////////////////
//   request(url, function(error, response, html){
//     if(!error)
//     {
//       var doc = cheerio.load(html);
//       var json = { name : "", price : "", description : "", link :"" , created_at :""};

//       doc('h1.title').filter(function(){
//           var data = doc(this);
//           name = data.text();

//           json.name = name;
//       })
//       doc('div.price-box').filter(function(){
//           var data = doc(this);
//           price = data.text();

//           json.price = price;
//       })
//       doc('div.list.-features.-compact.-no-float').filter(function(){
//           var data = doc(this);
//           description = data.text();
//           json.description = description;
//       })

//       json.link = url
//       json.created_at= new Date();
//       sample.push(json)
//     }
//     fs.writeFile('output.json', JSON.stringify(sample, null, 4), function(err){

//         console.log('File successfully written! - Check your project directory for the output.json file');

//     })

//     console.log(JSON.stringify(sample,null,4))

//       }) ;

//   }
//   //////////////////////////////
    

//   });
//  mango=stringify(sample,null,4)
//   // res.send(mango);
//  res.json({notes: "This is your notebook. Edit this to start saving your notes!"})




//     // testing the route
//     // res.send("WHEEE");

// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

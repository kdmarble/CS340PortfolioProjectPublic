/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./bdcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 8451);
app.set('mysql', mysql);
app.use('/systems', require('./systems.js'));
app.use('/', express.static('public'));
app.use('/stars', require('./stars.js'));
app.use('/planets', require('./planets.js'));
app.use('/moons', require('./moons.js'));

app.use(function(req, res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('404');
});

app.listen(app.get('port'), function(){
  console.log('Express started on port 8451')
});

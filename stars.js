module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getSystems(res, mysql, context, complete){
    mysql.pool.query("SELECT solarSystemID, name FROM SolarSystems", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.systems = results;
      complete();
    });
  };

  function getStars(res, mysql, context, complete){
    mysql.pool.query("SELECT starID, name, color, class, solarSystemID FROM Stars", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stars = results;
      complete();
    });
  };


  /*Display all of the stars in the table*/

  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ['deleteSystem.js']
    var mysql = req.app.get('mysql');
    getSystems(res, mysql, context, complete);
    getStars(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2){
        res.render('stars.handlebars', context);
      }
    }
  });

  /* Add a new star to the table, then redirects to load page again*/

  router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sqlString = "INSERT INTO Stars (name, color, class, solarSystemID) VALUES (?, ?, ?, ?)";
    var inserts = [req.body.name, req.body.color, req.body.class, req.body.solarSystemID];
    sql = mysql.pool.query(sqlString, inserts, function(error, results, fields){
      if(error){
        console.log(JSON.stringify(error));
        res.end();
      }else{
        res.redirect('/stars');
      }
    });
  });

  /* Route to delete a star from the table */

  router.delete('/:starID', function(req, res){
    var mysql = req.app.get('mysql');
    var sqlString = "DELETE FROM Stars WHERE starID = ?";
    var inserts = [req.params.starID];
    sql = mysql.pool.query(sqlString, inserts, function(error, results, fields){
      if(error){
        console.log(error)
        res.write(JSON.stringify(error));
        res.status(400);
        res.send();
      }else{
        res.status(202).end();
      }
    })
  })

  return router;
}();

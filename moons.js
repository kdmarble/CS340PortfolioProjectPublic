module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getMoons(res, mysql, context, complete){
    mysql.pool.query("SELECT moonID, name, position, planetID FROM Moons", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.moons = results;
      complete();
    });
  };

  function getPlanets(res, mysql, context, complete){
    mysql.pool.query("SELECT planetID, name, position, color, relativeSize, solarSystemID FROM Planets", function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.planets = results;
      complete();
    });
  };

  /*Display all of the planets in the table*/

  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ['deleteSystem.js']
    var mysql = req.app.get('mysql');
    getMoons(res, mysql, context, complete);
    getPlanets(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2){
        res.render('moons.handlebars', context);
      }
    }
  });

  router.post('/moon', function(req, res){
    var context = {};
    context.jsscripts = ['deleteSystem.js']
    var mysql = req.app.get('mysql');
    var sqlString = "SELECT moonID, name, position, planetID FROM Moons WHERE name = ?";
    var inserts = [req.body.name];
    sql = mysql.pool.query(sqlString, inserts, function(error, results, fields) {
      if (error) {
        console.log(error)
        res.write(JSON.stringify(error));
        res.status(400);
        res.send();
      }
      context.moons = results;
      res.render('moons.handlebars', context)
    })
  })

  /* Add a new moon to the table, then redirects to load page again*/

  router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sqlString = "INSERT INTO Moons (name, position, planetID) VALUES (?, ?, ?)";
    var inserts = [req.body.name, req.body.position, req.body.planetID];
    sql = mysql.pool.query(sqlString, inserts, function(error, results, fields){
      if(error){
        console.log(JSON.stringify(error));
        res.end();
      }else{
        res.redirect('/moons');
      }
    });
  });

  /* Route to delete a moon from the table */

  router.delete('/:moonID', function(req, res){
    var mysql = req.app.get('mysql');
    var sqlString = "DELETE FROM Moons WHERE moonID = ?";
    var inserts = [req.params.moonID];
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

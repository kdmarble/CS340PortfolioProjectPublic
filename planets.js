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

  function getPlanet(res, mysql, context, id, complete){
        var sql = "SELECT planetID, name, position, color, relativeSize, solarSystemID FROM Planets WHERE planetID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets = results[0];
            complete();
        });
    }

  /*Display all of the planets in the table*/

  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ['deleteSystem.js']
    var mysql = req.app.get('mysql');
    getSystems(res, mysql, context, complete);
    getPlanets(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2){
        res.render('planets.handlebars', context);
      }
    }
  });

  /* Add a new planet to the table, then redirects to load page again*/

  router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sqlString = "INSERT INTO Planets (name, position, color, relativeSize, solarSystemID) VALUES (?, ?, ?, ?, ?)";
    var inserts = [req.body.name, req.body.position, req.body.color, req.body.relativeSize, req.body.solarSystemID];
    sql = mysql.pool.query(sqlString, inserts, function(error, results, fields){
      if(error){
        console.log(JSON.stringify(error));
        res.end();
      }else{
        res.redirect('/planets');
      }
    });
  });

  /* Display one Planet for updating*/

  router.get('/:planetID', function(req, res){
        console.log(req.params.planetID)
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectSolarSystem.js", "updatePlanet.js"];
        var mysql = req.app.get('mysql');
        getPlanet(res, mysql, context, req.params.planetID, complete);
        getSystems(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-planet', context);
            }

        }
    });

  /* Update the Planet */

  router.put('/:planetID', function(req, res){
    var mysql = req.app.get('mysql');
    console.log(req.body)
    console.log(req.params.planetID)
    var sql = "UPDATE Planets SET name=?, position=?, color=?, relativeSize=?, solarSystemID=? WHERE planetID =?";
    var inserts = [req.body.name, req.body.position, req.body.color, req.body.relativeSize, req.body.solarSystemID,  req.params.planetID];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        console.log(error)
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.status(200);
        res.end();
      }
    });
  });

  /* Route to delete a star from the table */

  router.delete('/:planetID', function(req, res){
    var mysql = req.app.get('mysql');
    var sqlString = "DELETE FROM Planets WHERE planetID = ?";
    var inserts = [req.params.planetID];
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

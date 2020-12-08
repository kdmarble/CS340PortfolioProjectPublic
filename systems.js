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


  /*Display all of the systems in the table*/

  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ['deleteSystem.js']
    var mysql = req.app.get('mysql');
    getSystems(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        res.render('systems.handlebars', context);
      }
    }
  });

  /* Add a new Solar System tot he table, then redirects to load page again*/

  router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sqlString = "INSERT INTO SolarSystems (name) VALUES (?)";
    var inserts = [req.body.name];
    sql = mysql.pool.query(sqlString, inserts, function(error, results, fields){
      if(error){
        console.log(JSON.stringify(error));
        res.end();
      }else{
        res.redirect('/systems');
      }
    });
  });

  /* Route to delete a system from the table */
  
  router.delete('/:solarSystemID', function(req, res){
    var mysql = req.app.get('mysql');
    var sqlString = "DELETE FROM SolarSystems WHERE solarSystemID = ?";
    var inserts = [req.params.solarSystemID];
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

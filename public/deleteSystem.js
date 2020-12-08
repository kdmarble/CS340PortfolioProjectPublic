/*
var jquery = require('jquery');
*/

function deleteSystem(id){
  $.ajax({
    url: '/systems/' + id,
    type: 'DELETE',
    success: function(result){
      window.location.reload(true);
    }
  })
};

function deleteStar(id){
  $.ajax({
    url: '/stars/' + id,
    type: 'DELETE',
    success: function(result){
      window.location.reload(true);
    }
  })
};

function deletePlanet(id){
  $.ajax({
    url: '/planets/' + id,
    type: 'DELETE',
    success: function(result){
      window.location.reload(true);
    }
  })
};

function deleteMoon(id){
  $.ajax({
    url: '/moons/' + id,
    type: 'DELETE',
    success: function(result){
      window.location.reload(true);
    }
  })
};

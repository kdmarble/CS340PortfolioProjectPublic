function updatePlanet(id){
  $.ajax({
    url: '/planets/' + id,
    type: 'PUT',
    data: $('#updatePlanet').serialize(),
    success: function(result){
      window.location.replace("./")
    }
  })
};

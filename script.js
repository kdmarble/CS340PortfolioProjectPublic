//Use event delegation to create the event listeners
//Pretty much just make the row with the

const portNumber = 4852
const baseUrl = `http://flip3.engr.oregonstate.edu:` + portNumber

const deleteTable = function() {
    //Deletes the workoutTable
    var old_thead = document.querySelector('thead');

    var old_tbody = document.querySelector('tbody');
    var new_tbody = document.createElement('tbody');

    // Replaces the original tbody with a newly created empty tbody
    old_thead.parentNode.removeChild(old_thead);
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
}

const makeTable = function(dataTable){

  // Start with the header row
  makeHeaderRow();

  //Iterate over the rows
  for (var i=0; i < dataTable.results.length; i++) {
    // Create the row
    makeRow(dataTable.results[i]);
  }
    //Add the tableData cells each with data
    //Add the buttons
}

const makeHeaderRow = function() {
  //Creates header row of the table
  var workoutTable = document.getElementById('workoutTable');

  // Create the table head element
  var header = workoutTable.createTHead();

  // A list of the header cell contents
  var headerData = ['id', 'Name', 'Reps', 'Weight', 'Date',
                    'Units', 'Update Button', 'Delete Button']

  // Create a row in the table head
  var row = header.insertRow(0);

  // Loops through the headerdata array and creates a cell for each
  for (var i=0; i < headerData.length; i++) {
    var th = document.createElement('th');
    //console.log(headerData[i]);
    th.innerHTML = headerData[i];

    if ( i == 0 ) {
      th.classList.add("idTable");
    }
    //console.log(th)
    row.append(th);
  };

  // Create the body of the table
  workoutTable.createTBody();
}

const makeRow = function(row, headerRow = false) {
  // Use the data in the row to create the tableData cells
  //console.log(row);
  var {id, name, reps, weight, lbs, date } = row;

  var tableBody = document.querySelector('tbody');

  var new_row = tableBody.insertRow();

  console.log(row.date);

  row.date = row.date.substring(0, 10);

  for(const property in row) {
    var td = document.createElement('td');

    if (property == 'id') {
      td.classList.add("idTable");
    }

    if (property == 'lbs') {
      if (row[property] == 1) {
        td.innerHTML = 'lbs';
      } else {
        td.innerHTML = 'Kg';
      }
    } else {
      td.innerHTML = row[property];
    };

    new_row.append(td);
  };

  var buttonUpdate = document.createElement('td');
  buttonUpdate.innerHTML = "<button class='updateButton' type='button'>Update</button>";
  new_row.append(buttonUpdate);

  var buttonDelete = document.createElement('td');
  buttonDelete.innerHTML = "<button class='deleteButton' type'button'>Delete</button>";
  new_row.append(buttonDelete);

  //for( var i=0; i < row)
};

const getData = function() {
  //asynchronous call to send the request, and retreive data from the server
  //Will be a get request to the database
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open('GET', baseUrl, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400) {
        var response = JSON.parse(req.responseText);
        console.log(response);
        resolve( response );
      } else {
        console.log('Error in network request: ' + req.statusText);
      }
    });
    req.send();
  })
};

// Close the popup with the X button
document.querySelector('.closeButton').onclick = function(event) {

  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');

  popup.classList.remove('active');
  overlay.classList.remove('active');

}

//Submit the add form and rebuild the table
document.querySelector('#addButton').onclick = async function(event) {
  //event listener for the add form button
  let target = event.target;
  event.preventDefault();

  // Capture all the information from the form to send to the server
  var inputName = document.getElementById('inputName').value;
  var inputReps = document.getElementById('inputReps').value;
  var inputWeight = document.getElementById('inputWeight').value;
  var inputUnits = document.querySelector('input[name="units"]:checked').value;
  var inputDate = document.getElementById('inputDate').value;

  // Send the request to the server via POST
  var req = new XMLHttpRequest();
  var payload = { name:inputName, reps:inputReps, weight:inputWeight,
                  lbs:inputUnits, date:inputDate};

  req.open('POST', baseUrl, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', function() {
    if(req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      console.log(response);
    } else {
      console.log('Error in the network request ' + req.statusText);
    }});

  req.send(JSON.stringify(payload));

  // Send the query to the database to get all data
  let dataTable = await getData();
  deleteTable();
  makeTable(dataTable);
};

// Update or delete the row
document.querySelector('#workoutTable').onclick = async function(event) {
  //event listener for the update or delete buttons
  let target = event.target;

  // Send the request to delete a row if the Delete button is pressed
  if(target.className == 'deleteButton') {
    console.log('Pushed the delete button');

    // get the id of the row to send to the server
    var deleteId = target.parentNode.parentNode.firstChild.textContent;

    var req = new XMLHttpRequest();
    var payload = { id:deleteId };

    req.open('DELETE', baseUrl, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400) {
        var response = JSON.parse(req.responseText);
        console.log(response);
      } else {
        console.log('Error in the network request ' + req.statusText);
      }});

    req.send(JSON.stringify(payload));

    let dataTable = await getData();
    console.log('finshed the get')
    deleteTable();
    makeTable(dataTable);
  };


  // Handler for the Update button/feature
  if (target.className == 'updateButton') {

    var popup = document.getElementById('popup');
    var overlay = document.getElementById('overlay');

    popup.classList.add('active');
    overlay.classList.add('active');

    var rowId = target.parentNode.parentNode.firstElementChild;
    var rowName = rowId.nextElementSibling;
    var rowReps = rowName.nextElementSibling;
    var rowWeight = rowReps.nextElementSibling;
    var rowDate = rowWeight.nextElementSibling;

    var rowUnits = rowDate.nextElementSibling;

    if(rowUnits.textContent == 'Kg') {
      document.getElementById('updatekg').checked = true;
    } else {
      document.getElementById('updatelbs').checked = true;
    };

     console.log(rowId.textContent, rowName.textContent, rowWeight.textContent,
               rowReps.textContent, rowUnits.textContent, rowDate.textContent );

    document.getElementById('updateName').value = rowName.textContent;
    document.getElementById('updateReps').value = rowReps.textContent;
    document.getElementById('updateWeight').value = rowWeight.textContent;
    document.getElementById('updateUnits').value = rowUnits.textContent;
    document.getElementById('updateDate').value = rowDate.textContent.substring(0, 10);

    document.querySelector('#updateFormButton').onclick = async function(event) {
      //event listener for the update or delete buttons
      let target = event.target;
      event.preventDefault();

      rowId = rowId.textContent;
      rowName = document.getElementById('updateName').value;
      rowReps = document.getElementById('updateReps').value;
      rowWeight = document.getElementById('updateWeight').value;
      rowUnits = document.querySelector('input[name="updateUnits"]:checked').value;
      rowDate = document.getElementById('updateDate').value;

      console.log(rowId, rowName, rowReps, rowWeight, rowUnits, rowDate );

      var req = new XMLHttpRequest();
      var payload = { id:rowId, name:rowName, reps:rowReps,
                      weight:rowWeight, lbs:rowUnits, date:rowDate };

      req.open('PUT', baseUrl, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
          var response = JSON.parse(req.responseText);
          console.log(response);
        } else {
          console.log('Error in the network request ' + req.statusText);
        }});

      req.send(JSON.stringify(payload));

      let dataTable = await getData();
      console.log('finshed the get')
      deleteTable();
      makeTable(dataTable);

      var popup = document.getElementById('popup');
      var overlay = document.getElementById('overlay');
    
      popup.classList.remove('active');
      overlay.classList.remove('active');

  };


};

};

document.querySelector('#updateFormButton').onclick = async function(event) {
  //event listener for the update or delete buttons
  let target = event.target;
  event.preventDefault();


  // get the id of the row to send to the server
  var rowId = target.parentNode.parentNode.firstElementChild;
  var rowName = rowId.nextElementSibling;
  var rowReps = rowName.nextElementSibling;
  var rowWeight = rowReps.nextElementSibling;
  var rowDate = rowWeight.nextElementSibling;

  var rowUnits = rowDate.nextElementSibling;

  console.log(rowId.textContent, rowName.textContent, rowWeight.textContent,
            rowReps.textContent, rowUnits.textContent, rowDate.textContent );

  var req = new XMLHttpRequest();
  var payload = { id:deleteId };



  };

// Runs as soon as the page loads, intial get request
const pageLoad = async function() {

  let dataTable = await getData();
  console.log('made it here')

  console.log(dataTable);
  makeTable(dataTable);
};

pageLoad();

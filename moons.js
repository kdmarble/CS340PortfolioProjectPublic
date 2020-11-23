// Trigger submitMoon function when Submit button clicked
const addMoonForm = document.getElementById("addMoon");
addMoonForm.addEventListener("submit", submitMoon);

// Capture inputs for add moon form, POST to server
async function submitMoon(event){
  event.preventDefault();
  const name = document.getElementById("inputName").value;
  const position = document.getElementById("inputPosition").value;
  const size = document.getElementById("inputSize").value;
  const color = document.getElementById("inputColor").value;
  const parentSystem = document.getElementById("inputSolarSystem").value;
  const parentPlanetsSelect = document.getElementById("inputParentPlanet");

  const parentPlanets = [...parentPlanetsSelect.options].filter(option => option.selected).map(option => option.value);

  const inputs = {
    name: name,
    position: position,
    size: size,
    color: color,
    parentSystem: parentSystem,
    parentPlanets: parentPlanets
  }

  const response = await fetch("http://localhost:8080", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(inputs)
  });

  return response.json();
}

// Trigger searchMoon function when Submit button clicked
const searchMoonForm = document.getElementById("searchForm");
searchMoonForm.addEventListener("submit", searchMoon);

// Capture inputs for add moon form, POST to server
async function searchMoon(event){
  event.preventDefault();
  const name = document.getElementById("inputName").value;

  const inputs = {
    name: name
  }

  const response = await fetch("http://localhost:8080", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(inputs)
  });

  return response.json();
}

// Trigger deleteMoon function when Delete button clicked, use event delegation
// to pass event listener function to child button elements
const moonsList = document.getElementById("moonsList");
moonsList.addEventListener("click", deleteMoon);

// Send DELETE request to server
async function deleteMoon(event) {
  event.preventDefault();

  if (event.target && event.target.nodeName == "BUTTON") {
    const inputs = {
      moonID: 1
    }
  
    const response = await fetch("http://localhost:8080", {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputs)
    });
  
    return response.json();
  }

}
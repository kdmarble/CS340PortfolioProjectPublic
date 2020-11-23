// Trigger submitPlanet function when Submit button clicked
const addPlanetForm = document.getElementById("addPlanet");
addPlanetForm.addEventListener("submit", submitPlanet);

// Capture inputs for add planet form, POST to server
async function submitPlanet(event){
  event.preventDefault();
  const name = document.getElementById("inputName").value;
  const position = document.getElementById("inputPosition").value;
  const size = document.getElementById("inputSize").value;
  const color = document.getElementById("inputColor").value;
  const parentSystem = document.getElementById("inputSolarSystem").value;
  const childMoonsSelect = document.getElementById("inputChildMoon");

  const childMoons = [...childMoonsSelect.options].filter(option => option.selected).map(option => option.value);

  const inputs = {
    name: name,
    position: position,
    size: size,
    color: color,
    parentSystem: parentSystem,
    childMoons: childMoons
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

// Trigger deletePlanet function when Delete button clicked, use event delegation
// to pass event listener function to child button elements
const planetsList = document.getElementById("planetsList");
planetsList.addEventListener("click", deletePlanet);

// Send DELETE request to server
async function deletePlanet(event) {
  event.preventDefault();

  if (event.target && event.target.nodeName == "BUTTON") {
    const inputs = {
      planetID: 1
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
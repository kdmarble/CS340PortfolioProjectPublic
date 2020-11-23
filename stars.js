// Trigger submitStar function when Submit button clicked
const addStarForm = document.getElementById("addStar");
addStarForm.addEventListener("submit", submitStar);

// Capture inputs for add star form, POST to server
async function submitStar(event){
  event.preventDefault();
  const name = document.getElementById("inputName").value;
  const color = document.getElementById("inputColor").value;
  const inputClass = document.getElementById("inputClass").value;

  const inputs = {
    name: name,
    color: color,
    class: inputClass
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

// Trigger deleteStar function when Delete button clicked, use event delegation
// to pass event listener function to child button elements
const starsList = document.getElementById("starsList");
starsList.addEventListener("click", deleteStar);

// Send DELETE request to server
async function deleteStar(event) {
  event.preventDefault();

  if (event.target && event.target.nodeName == "BUTTON") {
    const inputs = {
      starID: 1
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

// Trigger updateStar function when Submit button clicked
const updateStarForm = document.getElementById("updateStar");
updateStarForm.addEventListener("submit", updateStar);

// Capture inputs for add star form, POST to server
async function updateStar(event){
  event.preventDefault();
  const name = document.getElementById("updatedName").value;
  const color = document.getElementById("updatedColor").value;
  const updatedClass = document.getElementById("updatedClass").value;

  const inputs = {
    name: name,
    color: color,
    class: updatedClass
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
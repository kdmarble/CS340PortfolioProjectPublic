// Trigger submitSystem function when Submit button clicked
const addSystemForm = document.getElementById("addSystem");
addSystemForm.addEventListener("submit", submitSystem);

// Capture inputs for add system form, POST to server
async function submitSystem(event){
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

// Trigger deleteSystem function when Delete button clicked
const deleteSystemButton = document.getElementById("deleteSystem");
deleteSystemButton.addEventListener("click", deleteSystem);

// Send DELETE request to server
async function deleteSystem(event) {
  event.preventDefault();

  const inputs = {
    systemID: 1
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
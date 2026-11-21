import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  try {
    const response = await fetch(`${config.backendEndpoint}/cities`);
    const data = await response.json();
    // console.log('uhuj', data)
    return data;
  } catch (error) {
    // console.log("llll", error);
    return null;
  }
}
//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM
  const data = document.getElementById("data");

  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-xl-3 mb-4";

  col.innerHTML = `
    <a href="pages/adventures/?city=${id}" id="${id}" class="tile-link">
      <div class="tile">
        <img src="${image}" alt="${city}" class="img-fluid" />
        <div class="tile-text text-center">
          <h5>${city}</h5>
          <p>${description}</p>
        </div>
      </div>
    </a>
  `;

  data.appendChild(col);
}

export { init, fetchCities, addCityToDOM };

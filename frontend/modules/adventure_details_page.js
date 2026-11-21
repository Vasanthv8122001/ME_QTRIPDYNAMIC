import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("adventure");
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  try {
    const res = await fetch(
      `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    // Backend is down or the response is not valid JSON
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  document.getElementById("adventure-name").innerHTML = adventure.name;
  document.getElementById("adventure-subtitle").innerHTML = adventure.subtitle;
 
  // One div per image, inside #photo-gallery, using the activity-card-image class
  const gallery = document.getElementById("photo-gallery");
  adventure.images.forEach((image) => {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${image}" class="activity-card-image" alt="${adventure.name}">`;
    gallery.appendChild(div);
  });
 
  document.getElementById("adventure-content").innerHTML = adventure.content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  const gallery = document.getElementById("photo-gallery");
 
  // Overwrite whatever addAdventureDetailsToDOM() put in the gallery
  gallery.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators"></ol>
      <div class="carousel-inner"></div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>`;
 
  const indicators = gallery.querySelector(".carousel-indicators");
  const inner = gallery.querySelector(".carousel-inner");
 
  images.forEach((image, index) => {
    // Indicator dot
    const li = document.createElement("li");
    li.setAttribute("data-target", "#carouselExampleIndicators");
    li.setAttribute("data-slide-to", String(index));
    if (index === 0) li.classList.add("active");
    indicators.appendChild(li);
 
    // Slide: only the first one is "active"
    const item = document.createElement("div");
    item.className = index === 0 ? "carousel-item active" : "carousel-item";
    item.innerHTML = `<img src="${image}" class="d-block w-100 activity-card-image" alt="Adventure image ${index + 1}">`;
    inner.appendChild(item);
  });
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  const soldOut = document.getElementById("reservation-panel-sold-out");
  const available = document.getElementById("reservation-panel-available");

  if (adventure.available) {
    soldOut.style.display = "none";
    available.style.display = "block";
    document.getElementById("reservation-person-cost").innerHTML = adventure.costPerHead;
  } else {
    available.style.display = "none";
    soldOut.style.display = "block";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  document.getElementById("reservation-cost").innerHTML = adventure.costPerHead * persons;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the normal page reload

    const data = {
      name: form.elements["name"].value,
      date: form.elements["date"].value,
      person: form.elements["person"].value,
      adventure: adventure.id,
    };

    try {
      const res = await fetch(`${config.backendEndpoint}/reservations/new`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Success!");
        window.location.reload(); // refresh so the reserved banner shows
      } else {
        alert("Failed!");
      }
    } catch (err) {
      alert("Failed!");
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  const banner = document.getElementById("reserved-banner");
  banner.style.display = adventure.reserved ? "block" : "none";
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};

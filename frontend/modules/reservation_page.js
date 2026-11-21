import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  try {
    const res = await fetch(`${config.backendEndpoint}/reservations/`);
    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  const noReservationBanner = document.getElementById("no-reservation-banner");
  const tableParent = document.getElementById("reservation-table-parent");

  // Show the table when there are reservations, otherwise the "no reservations" banner
  if (reservations.length > 0) {
    noReservationBanner.style.display = "none";
    tableParent.style.display = "block";
  } else {
    noReservationBanner.style.display = "block";
    tableParent.style.display = "none";
  }

  const table = document.getElementById("reservation-table");

  reservations.forEach((reservation) => {
    // Date column, e.g. 18/11/2020
    const date = new Date(reservation.date).toLocaleDateString("en-IN");

    // Booking time column, e.g. 18 November 2020, 11:08:27 am
    const bookedAt = new Date(reservation.time);
    const bookingTime =
      bookedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) +
      ", " +
      bookedAt.toLocaleTimeString("en-IN");

    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row"><b>${reservation.id}</b></th>
      <td>${reservation.name}</td>
      <td>${reservation.adventureName}</td>
      <td>${reservation.person}</td>
      <td>${date}</td>
      <td>${reservation.price}</td>
      <td>${bookingTime}</td>
      <td>
        <div class="reservation-visit-button" id="${reservation.id}">
          <a href="../detail/?adventure=${reservation.adventure}">Visit Adventure</a>
        </div>
      </td>`;
    table.appendChild(row);
  });
}

export { fetchReservations, addReservationToTable };

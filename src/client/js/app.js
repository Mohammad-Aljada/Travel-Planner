import axios from "axios";

export const addTrip = async (e) => {
  e.preventDefault();
  const location = document.getElementById("location").value;
  const TripDate = document.getElementById("departure-date").value;
  const errorMessage = document.getElementById('error-message');
  const currentDate = new Date();

  if (!location || !TripDate) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Location and date are required.';
    return;
  }

  if (new Date(TripDate) < currentDate) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Departure date must be in the future.';
    return;
  }

  errorMessage.style.display = 'none';
  try {
    console.log("send request at /api/trip");
    const response = await axios.post(
      "http://localhost:3000/addtrip",
      { location, date: TripDate },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;

    document.getElementById("trip-details").innerHTML = `
      <h2>My trip to: ${data.city}, ${data.country}</h2>
      <p>Departure: ${TripDate}</p>
      <p>Weather: ${data.weather.description} - ${data.weather.temp}°C</p>
      <img src="${data.image}" alt="Destination Image" style="max-width:300px;">
      <button id="remove-trip">Remove Trip</button>
    `;
    document.getElementById('remove-trip').addEventListener('click', removeTrip);
  } catch (error) {
    console.error("Error fetching trip data:", error);
  }
};
const removeTrip = async () => {
  try {
    const response = await axios.delete("http://localhost:3000/removetrip");
    console.log(response.data.message);
    document.getElementById("trip-details").innerHTML = "";
  } catch (error) {
    console.error("Error deleting trip data:", error);
  }
};


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-trip').addEventListener('click', addTrip);

});
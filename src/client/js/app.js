import axios from "axios";

export const addTrip = async (e) => {
  e.preventDefault();
  const location = document.getElementById("location").value;
  const date = document.getElementById("departure-date").value;

  if (!location || !date) {
    alert("Please enter a location and departure date!");
    return;
  }

  try {
    console.log("send request at /api/trip");
    const response = await axios.post(
      "http://localhost:3000/addtrip",
      { location, date },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;

    document.getElementById("trip-details").innerHTML = `
      <h2>My trip to: ${data.city}, ${data.country}</h2>
      <p>Departure: ${date}</p>
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


document.addEventListener('DOMContentLoaded', () => 
  {
     document.getElementById('add-trip').addEventListener('click', addTrip); 

});
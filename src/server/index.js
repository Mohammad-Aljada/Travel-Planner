import express from "express";
import cors from "cors";
import axios from "axios";

import { config } from 'dotenv';

config(); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

app.post('/addtrip', async (req, res) => {
  console.log('Received request at /addtrip');
  const { location, date } = req.body;
  console.log('Request body:', req.body);
  if (!location || !date) {
    return res.status(400).send('Location and date are required.');
  }
  try { // Geonames API: Get latitude and longitude
    console.log('Calling Geonames API...');
    const geoResponse = await axios.get(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${process.env.GEONAMES_API}`)
      .catch(error => {
        console.error('Error calling Geonames API:', error.message);
        throw error;
      });
    console.log('Geonames API response:', geoResponse.data);
    if (!geoResponse.data.geonames.length) {
      throw new Error('Location not found in Geonames API.');
    }
    const { lat, lng, countryName } = geoResponse.data.geonames[0];
    // Weatherbit API: Get weather data
    console.log('Calling Weatherbit API...');
    const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHER_API}`)
      .catch(error => {
        console.error('Error calling Weatherbit API:', error.message);
        throw error;
      });
    console.log('Weatherbit API response:', weatherResponse.data);
    if (!weatherResponse.data.data.length) {
      throw new Error('Weather data not found in Weatherbit API.');
    }
    const weather = weatherResponse.data.data[0];
    // Pixabay API: Get image
    console.log('Calling Pixabay API...');
    const pixabayResponse = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API}&q=${location}&image_type=photo&orientation=horizontal&safesearch=true`)
      .catch(error => {
        console.error('Error calling Pixabay API:', error.message);
        throw error;
      });
    console.log('Pixabay API response:', pixabayResponse.data);
    if (!pixabayResponse.data.hits.length) {
      throw new Error('Image not found in Pixabay API.');
    }
    const image = pixabayResponse.data.hits[0].webformatURL;
    res.json({
      city: location,
      country: countryName,
      weather: { description: weather.weather.description, temp: weather.temp }, image, date,
    });
  } catch (error) {
    console.error('Error fetching data from APIs:', error.message);
    res.status(500).send(`Error fetching data from APIs: ${error.message}`);
  }
});

app.delete('/removetrip', async (req, res) => {
  console.log('Received request at /removetrip');
  try {
    res.json({ message: 'Trip deleted' });
    } catch (error) {
    console.error('Error deleting trip data:', error);
    res.status(500).send(`Error deleting trip data: ${error.message}`);
  }
});

const port = process.env.PORT || 3000;

    app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

export default app;

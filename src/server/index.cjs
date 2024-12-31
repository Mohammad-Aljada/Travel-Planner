
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dontenv = require('dotenv');
const { getCoordinates, getWeather, getImage } = require('./apiHelper.cjs');
const bodyParser = require('body-parser');


dontenv.config();

const GEONAMES_API = process.env.GEONAMES_API;
const WEATHER_API = process.env.WEATHER_API;
const PIXABAY_API = process.env.PIXABAY_API;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

app.post('/addtrip', async (req, res) => {
  // console.log('Received request at /addtrip');
  const { location, date } = req.body;
  console.log('Request body:', req.body);

  if (!location || !date) {
    return res.status(400).json({
      success: false,
      error: 'Location and date are required.',
    });
  }
  try {
    const { lat, lng, countryName } = await getCoordinates(location, GEONAMES_API);
    const weather = await getWeather(lat, lng, WEATHER_API);
    const image = await getImage(location, PIXABAY_API);

    res.status(200).json({
      city: location,
      country: countryName,
      weather,
      image,
      date,
      message: 'Trip added successfully',
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`Error fetching data from APIs: ${error.message}`);
  }
});

app.delete('/removetrip', async (req, res) => {
  //console.log('Received request at /removetrip');
  try {
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip data:', error);
    res.status(500).send(`Error deleting trip data: ${error.message}`);
  }
});



app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});

module.exports = app ;

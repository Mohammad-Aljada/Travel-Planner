const axios = require('axios');

const getCoordinates = async (location, geonamesApiKey) => {
    const url = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${geonamesApiKey}`;
    const response = await axios.get(url);
    if (!response.data.geonames.length) {
        throw new Error('Location not found in Geonames API.');
    }
    const { lat, lng, countryName } = response.data.geonames[0];
    return { lat, lng, countryName };
};

const getWeather = async (lat, lng, weatherApiKey) => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherApiKey}`;
    const response = await axios.get(url);
    if (!response.data.data.length) {
        throw new Error('Weather data not found in Weatherbit API.');
    }
    const weather = response.data.data[0];
    return { description: weather.weather.description, temp: weather.temp };
};

const getImage = async (location, pixabayApiKey) => {
    const url = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${location}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    if (!response.data.hits.length) {
        throw new Error('Image not found in Pixabay API.');
    }
    return response.data.hits[0].webformatURL;
};

module.exports = {
    getCoordinates,
    getWeather,
    getImage,
};

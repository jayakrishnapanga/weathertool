const fetch = require('node-fetch');  
require('dotenv').config();
async function getWeather(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    console.log(apiKey)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log(url)
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
}

// (async () => {
//     try {
//         console.log(await getWeather('vijayawada'));
//     } catch (error) {
//         console.error('Error fetching weather:', error.message);
//     }
// })();

module.exports = getWeather;
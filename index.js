const express = require('express');
const request = require('request');
const htmlEntities = require('html-entities');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/weather', (req, res) => {
  const city = req.body.city;
  const encodedCity = htmlEntities.encode(city);

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=63e1f617c1ec6a0de04662281f86ec15&units=metric`;

  request(apiUrl, (error, response, body) => {
    try {
      if (error) {
        throw new Error(`Error in the request: ${error}`);
      }

      const data = JSON.parse(body);

      if (response.statusCode === 200) {
        const formattedCity = `<strong style="text-transform: uppercase;">${encodedCity}</strong>`;
        const formattedTemp = `<strong style="text-transform: uppercase;">${data.list[0].main.temp}°C</strong>`;
        const formattedWeather = `<strong style="text-transform: uppercase;">${data.list[0].weather[0].description}</strong>`;
        res.send(`CITY ${formattedCity}</br> TEMPERATURE ${formattedTemp}</br> WEATHER ${formattedWeather}`);
      } else {
        throw new Error(`OpenWeatherMap API error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

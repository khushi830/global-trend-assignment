// File: index.js
require("dotenv").config();
const { fetchKey, fetchHourly } = require("./api");

const main = async () => {
    const args = process.argv.slice(2);
    const userCity = args[0] || "Delhi";

    console.log(`Fetching weather for ${userCity}...\n`);

    // ---- STEP 1: Fetch city key
    const keyData = await fetchKey(userCity);

    if (!keyData) {
        console.log("City not found. Try another name.");
        return;
    }

    // ---- STEP 2: Fetch hourly weather
    const weather = await fetchHourly(keyData.key);

    if (!weather || weather.length === 0) {
        console.log("Weather data not available.");
        return;
    }

    const current = weather[0];

    // ---- DISPLAY RESULT ----
    console.log("----------------------------------------");
    console.log(`CITY: ${keyData.name}`);
    console.log(`Temperature: ${current.Temperature.Value}F`);
    console.log(`Condition: ${current.IconPhrase}`);
    console.log("----------------------------------------\n");
};

main();

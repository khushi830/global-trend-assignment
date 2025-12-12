const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Configuration
const API_KEY = process.env.API_KEY ;
const DATA_FILE = process.env.DATA_FILE ;
const CACHE_LIMIT = 12 * 60 * 60 * 1000; // 12 Hours

// --- API Functions ---

const fetchKey = async (cityName, isSilent = false) => {
    const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${cityName}`;

    if (!isSilent) console.log(`Searching for city: ${cityName}...`);

    try {
        const response = await axios.get(url, { timeout: 5000 });
        
        if (response.data && response.data.length > 0) {
            const data = response.data[0];
            if (!isSilent) console.log(`Found: ${data.EnglishName} (Key: ${data.Key})`);
            return { key: data.Key, name: data.EnglishName };
        } else {
            if (!isSilent) console.log("City not found.");
            return null;
        }
    } catch (error) {
        if (!isSilent) {
            if (error.code === 'ECONNABORTED') {
                console.error("Error: Request timed out.");
            } else {
                console.error("Search failed:", error.message);
            }
        }
        return null;
    }
};

const fetchHourly = async (cityKey) => {
    const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${API_KEY}`;
    try {
        const response = await axios.get(url, { timeout: 5000 });
        return response.data;
    } catch (e) { return null; }
};

const fetchDaily = async (cityKey) => {
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${API_KEY}`;
    try {
        const response = await axios.get(url, { timeout: 5000 });
        return response.data ? response.data.DailyForecasts[0] : null;
    } catch (e) { return null; }
};

// --- Database Functions ---

const loadDB = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE));
        }
    } catch (e) {
        // Ignore error, return default
    }
    return { homeCity: null, capitalsList: [], lastUpdated: null };
};

const saveDB = (db) => {
    db.lastUpdated = Date.now();
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    // console.log("Database saved."); // Uncomment if you want to see save confirmation
};

module.exports = {
    fetchKey,
    fetchHourly,
    fetchDaily,
    loadDB,
    saveDB,
    CACHE_LIMIT
};
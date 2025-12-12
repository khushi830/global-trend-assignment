# Weather CLI Tool 🌤️  
> A Global Trend Internship Assignment  

A robust Node.js command-line application that fetches real-time weather data for any city and provides a filtered summary of Indian State Capitals.  
This tool demonstrates API integration, caching, region filtering, error handling, and data enrichment.

---

## 1. Generate Your AccuWeather API Key

1. Visit the official AccuWeather Developer Portal:  
   https://developer.accuweather.com/subscriptions

2. Sign in and subscribe to the **Free Tier**.

3. Create an App → Copy your **API Key**.

4. Create a `.env` file inside your project folder and paste your API key.

---

## 2. Environment File Setup (`.env`)

Inside your project folder, create a file named `.env` with:

  ***API_KEY="API_KEY_VALUE"***
  ***DATA_FILE="YOUR_CACHE_FILENAME"***
---

## 3. Setup & Run Instructions

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine.

### 2. Installation
Open your terminal in the project folder and install the required dependencies:
```bash
npm install
```

### 3. Configuration
Open index.js.

Locate the API_KEY variable at the top.

Paste your AccuWeather API Key inside the quotes.

### 4. How to Run
Basic Usage (Check your city):

```bash

node "getSpecificCityData.js" "Bhopal"
```
To see all list state capitals:

```bash

node node "getCapitalsData.js" 

```
Advanced Usage (With Filters): a filtered list of state capitals (e.g., North India):

```bash

node  "getCapitalsData.js" "North"

```

### API Endpoints 
1. Get City Key
```bash
https://dataservice.accuweather.com/locations/v1/cities/search?apikey=API_KEY&q=Bhopal
```


2. Get 12-hour weather
```bash

https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/CITY_KEY?apikey=API_KEY
```


3. Get daily summary (state capitals)
```bash
https://dataservice.accuweather.com/forecasts/v1/daily/1day/CITY_KEY?apikey=API_KEY
```

### Filters Implemented
You can filter the list of 29 State Capitals using the second command-line argument:

### Region Filters:

North

South

East

West

Central

### Temperature Filters:

Hot: Displays cities with max temp > 90°F.

Cold: Displays cities with max temp < 70°F.

## Assumptions & Technical Notes
1. Caching Strategy 💾
Why? The free API tier is limited to 500 calls/day.

How? All fetched data is saved to weather_db.json.

Expiry: The cache automatically invalidates and refreshes if the data is older than 12 hours.

2. Data Enrichment 🗺️
The API provides weather data but not geographical regions (e.g., "North India"). A local Master List was implemented to map cities to their respective regions to enable filtering.

3. **Error Handling 🛡️
Network Timeouts: Requests are aborted if they take longer than 5 seconds.

Invalid Inputs: Friendly error messages are shown if a city name is misspelled.

## Project Structure
global-trend-assignment/              
│── api.js                  
│── capitals.js             
│── getSpecificCityData.js  
│── getCapitalsData.js      
│── .env                    
│── package.json            
└── README.md               
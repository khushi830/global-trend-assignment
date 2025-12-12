const { loadDB, saveDB, CACHE_LIMIT } = require('./api');
const getSpecificCityData = require('./getSpecificCityData');
const getCapitalsData = require('./getcapitalsdata');

const main = async () => {
    // 1. Setup
    let db = loadDB();
    const args = process.argv.slice(2);
    const userCity = args[0] || "Delhi";
    const filterArg = args[1];

    // 2. Check Expiry
    if (db.lastUpdated) {
        const age = Date.now() - db.lastUpdated;
        if (age > CACHE_LIMIT) {
            console.log("Cache expired. Refreshing data...");
            db.homeCity = null;
            db.capitalsList = [];
            db.lastUpdated = null;
        }
    }

    // 3. Get Home City
    console.log(`Fetching weather for ${userCity}...`);
    const homeData = await getSpecificCityData(userCity);
    if (homeData) db.homeCity = homeData;

    // 4. Get Capitals (Delegate to the new file!)
    if (!db.capitalsList || db.capitalsList.length === 0) {
        db.capitalsList = await getCapitalsData();
    } else {
        console.log("Loaded capitals from cache.");
    }

    // 5. Save & Display
    saveDB(db);

    console.log("\n----------------------------------------");
    if (db.homeCity) {
        console.log(`HOME: ${db.homeCity.name}`);
        const current = db.homeCity.forecast[0];
        console.log(`Current: ${current.Temperature.Value}F - ${current.IconPhrase}`);
    }
    console.log("----------------------------------------");

    // Filter Logic
    let list = db.capitalsList;
    if (filterArg) {
        console.log(`Filter Applied: ${filterArg}`);
        if (filterArg === "Hot") list = list.filter(c => c.temp > 90);
        else if (filterArg === "Cold") list = list.filter(c => c.temp < 70);
        else list = list.filter(c => c.region === filterArg);
    }

    console.log(`STATE CAPITALS (${list.length} results):`);
    list.forEach(c => {
        console.log(` [${c.region}] ${c.name}: ${c.temp}F (${c.condition})`);
    });
    console.log("----------------------------------------\n");
};

main();
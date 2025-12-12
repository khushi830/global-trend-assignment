require("dotenv").config();
const { fetchKey, fetchDaily } = require("./api");
const INDIAN_CAPITALS = require("./capitals");

// Optional CLI filter
const filterArg = process.argv[2] || null;

const getCapitalsData = async () => {
    console.log("Fetching weather for ALL state capitals...");

    let results = [];

    for (const city of INDIAN_CAPITALS) {
        const cityInfo = await fetchKey(city.name, true);

        if (cityInfo) {
            const weather = await fetchDaily(cityInfo.key);

            if (weather) {
                process.stdout.write(".");

                results.push({
                    name: city.name,
                    region: city.region,
                    state: city.state,
                    temp: weather.Temperature.Maximum.Value,
                    condition: weather.Day.IconPhrase,
                });
            }
        }
    }

    console.log("\nUpdating cache...");
    console.log("Capitals weather updated successfully!\n");

    return results;
};

// 🔥 MAIN SCRIPT EXECUTION
(async () => {
    const capitals = await getCapitalsData();

    let list = capitals;

    if (filterArg) {
        console.log(`Applying filter: ${filterArg}`);

        if (filterArg === "Hot") {
            list = list.filter(c => c.temp > 90);
        } else if (filterArg === "Cold") {
            list = list.filter(c => c.temp < 70);
        } else {
            list = list.filter(c => c.region === filterArg);
        }
    }

    console.log(`\nSTATE CAPITALS (${list.length} results):`);
    list.forEach(c => {
        console.log(` [${c.region}] ${c.name}: ${c.temp}F (${c.condition})`);
    });

    console.log("\n");
})();

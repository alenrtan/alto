import { getForecastLink, getForecast } from "./weatherAPI";

const fetchWeather = async () => {
        try{
            const coords = JSON.parse(localStorage.getItem("userAddress"));
            const link = await getForecastLink(coords.lat, coords.long);
            console.log("forecastLink is: ", link);

            const response = await getForecast(link);
            console.log("Response contains:", response)
            const data = response;

            console.log(data);
        }catch(err){
            console.log("Unable to get weather data. Error in fetchWeather function", err)
        }
}

export { fetchWeather }
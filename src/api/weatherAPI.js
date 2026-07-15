import axios from "axios";

// function to get metadata from NWS - which contains the forecast link for location
// use `properties` object to obtain forecast, hourly forecast
export const getForecastLink = async (lat, long) => {
    const NWS_METADATA_API_URL =  `https://api.weather.gov/points/${lat},${long}`

    try{
        console.log("getting metadata: ", NWS_METADATA_API_URL)
        const response = await axios.get(NWS_METADATA_API_URL);

        if (response.data && response.data.properties.forecast.length > 0){
            return response.data.properties.forecast;
        }else{
            console.error("Forecast link not found. Check location.");
        }
    }catch(error){
        console.error("Error getting NWS metadata. ", error);
        return null;
    }
}

export const getForecast = async (forecastLink) => {
    try{
        console.log("getting forecast data: ", forecastLink)
        const response = await axios.get(forecastLink);

        if (response.data && response.data.properties.periods.length > 0){
            return response.data.properties.periods
        }else{
            console.error("Forecast data not found. Check object.")
        }
    }catch(error){
        console.error("Error getting forecast data. API endpoint error - check weatherAPI.js", error)
    }
}
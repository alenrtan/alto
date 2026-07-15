import React, {useState, useEffect } from "react"
import { Link } from "react-router-dom"
import FooterItems from "../components/FooterItems"
import AddressForm from "../components/AddressForm"
import '../styles/main.css'
import { getCoordinatesUsingAddress, getCoordinatesUsingZipcode } from "../api/geocoding"
import { getForecast, getForecastLink } from "../api/weatherAPI"

export default function App() {

    // check if first-time user
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

    useEffect(() => {
        // check local storage 
        const storedAddress = localStorage.getItem("userAddress")
        if (storedAddress){
            setIsFirstTimeUser(false);
        }
    }, [])

    // locally storing user address
    const handleAddressFormSubmit = async (addressData) => {

        // begin checks; validate user input before calling NWS
        let coords = null; // update this after finding

        // logic: check addressData fields, if all are present (other than zip code as that's optional for thsis)
        // use that to get coords,
        // if no address is present, but just a zipcode (user used zipcode only form) get coords using zipcode
        // tldr; address > zipcode
        if (addressData.street && addressData.city && addressData.state){
            const address = `${addressData.street} ${addressData.city}, ${addressData.state}`
            coords = await getCoordinatesUsingAddress(address);
        }else if (addressData.zip){
            coords = await getCoordinatesUsingZipcode(addressData.zip)
        }else{
            alert("Please enter a valid address or zipcode")
        }

        if(coords){
            localStorage.setItem("userAddress", JSON.stringify(coords)) 
            console.log("Address coordinates saved locally: ", coords);
            setIsFirstTimeUser(false);
        }
    }

    // fetch weather data from api endpoint
    useEffect(() => {
        console.log("useEffect running fetchWeather...")
        fetchWeather();
    }, []);

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
            console.log("Unable to get weather data. Error in landing file", err)
        }
    }

    // returning the actual page
    return (
        <div className="main-container">
            <div className="header-container">
                Alto
            </div>
            <div className="subheader-container">
                <Link to="/" className="links">Home</Link>
                <Link to="/options" className="links">Options</Link>
                <Link to="/about" className="links">About</Link>
            </div>

            <div className="form-container">
                {
                    // checking for first time user & displaying forms if needed
                    isFirstTimeUser ? (
                        <>
                        <div className="text-container">Welcome to Alto</div><div className="text-container">
                            In order to obtain weather data, please enter your address below
                            <br />
                        </div><AddressForm onSubmit={handleAddressFormSubmit} />
                        </>
                    ) : (
                        <div>
                            <div className='text-container'>Weather Data will be here
                                <button onClick={fetchWeather}>Get Weather Data</button>
                            </div>
                        </div>
                    )
                }
            </div>
            <FooterItems />
        </div>
    )
}
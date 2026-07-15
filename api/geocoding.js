// strictly for vercel

import axios from "axios";

export default async function handler(req, res){
    // Chrome extension CORS blockage fix
    // so yeah * bad, figure this out 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS"){
        return res.status(200).end();
    }

    // don't allow GET functions get it from the body
    if (req.method === "GET"){
        return res.status(405).json({error: "GET method not allowed. POST ONLY"})
    }
    // change to req.body so address won't be stored in vercel logs
    const {address} = req.body;
    
    if (!address){
        return res.status(400).json({ error: "Missing address" });
    }

    const GEOCODER_API_URL = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(address)}&benchmark=4&format=json`
    
    try{
        console.log("Getting geocoder data...")
        const response = await axios.get(GEOCODER_API_URL)
        res.json(response.data);
    }catch(error){
        console.error("Error fetching geocoding data", error)
        res.status(500).json({ error: "Failed to fetch geocode data", details: error });
    }
    
}
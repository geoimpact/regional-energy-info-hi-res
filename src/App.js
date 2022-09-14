import './App.css';
import {useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import districts from "./data/districts.json";
import axios from "axios";

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const googleSearchCx = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;
function App() {
    const [data, setData] = useState(null);
    useEffect(() => {

    }, [])
    const scan = async () => {
        let districtsTemp = districts.Daten.slice(0, 5);
        for(let i = 0; i < districtsTemp.length; i++){
            let data = districtsTemp[i];
            console.log("scanning", data.Gemeindename);
            let searchText = `${data.Gemeindename} Energie`;
            let response = await axios({
                method: "get",
                url: `https://customsearch.googleapis.com/customsearch/v1?q=${searchText}&cx=${googleSearchCx}&key=${googleApiKey}`,
                headers: {
                    "Accept": "application/json"
                }
            });
            let newData = {
                ...(data || {})
            };
            newData[`${data.Gemeindename}`] = response.data;
            setData(newData);
        }
    }
    return (
        <div id={"App"}>
            <Typography variant={"h1"}>regional-energy-info-hi-res</Typography>
            <Typography variant={"body1"}>regional-energy-info-hi-res</Typography>
            <Button onClick={() => {
                scan();
            }}>
                scan
            </Button>
            <div>
                REACT_APP_GOOGLE_API_KEY: {process.env.REACT_APP_GOOGLE_API_KEY}
            </div>
            <div>
                {
                    JSON.stringify(data)
                }
            </div>
            {/*<div>
                {
                    districts.Daten.map(d => d.Gemeindename).join(", ")
                }
            </div>*/}
        </div>
    );
}

export default App;

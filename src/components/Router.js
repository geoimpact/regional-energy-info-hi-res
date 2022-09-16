import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import districts from "../data/districts.json";
import providers from "../data/providers.json";
import axios from "axios";
import {Button, Card, Container, TextareaAutosize, Typography} from "@mui/material";
import {useEffect, useState} from "react";

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const googleSearchCx = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;
const backendUrl = process.env.REACT_APP_BACKEND_1;


providers = providers
    .filter(p => p.Link && p.Link.trim().length > 0)
    .filter(p => p.Link.startsWith("https"));

async function requestScraping(url, body){
    return axios({
        method: "post",
        url: url,
        data: body
    });
}

function Scrape() {
    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(0);
    useEffect(() => {

    }, [])
    const scan = async () => {
        let districtsTemp = districts.Daten.slice(0, 5);
        for (let i = 0; i < districtsTemp.length; i++) {
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
    const scrapeProviders = async () => {
        for(let i = 0; i < providers.length; i++){
            let provider = providers[i];
            console.log(`scraping provider ${provider.Name}: ${provider.Link}`, provider);
            await requestScraping(backendUrl, {
                url: provider.Link
            }).catch(e => e.response);
            setProgress(i);
        }
    }
    return (
        <Card id={"App"} style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Typography variant={"h6"}>Service Providers</Typography>
            <TextareaAutosize
                value={providers.map(p => p.Link).join("\n")}
                maxRows={10}
                style={{
                    minWidth: "400px",
                    minHeight: "200px",
                    maxHeight: "300px"
                }}>
            </TextareaAutosize>
            <Typography variant={"h6"}>Municipalities</Typography>
            <TextareaAutosize
                value={"Municipalities"}
                maxRows={10}
                style={{
                    minWidth: "400px",
                    minHeight: "200px",
                    maxHeight: "300px"
                }}>
            </TextareaAutosize>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Button onClick={async () => {
                    await scrapeProviders();
                }}>
                    scan
                </Button>
                <div>{progress}/{providers.length}</div>
            </Container>
        </Card>
    );
}

function Util() {
    return (
        <div>
            Util
        </div>
    )
}

function Home() {
    return (
        <div>
            Home
        </div>
    )
}


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/util" element={<Util/>}/>
                <Route path="/scrape" element={<Scrape/>}/>
            </Routes>
        </BrowserRouter>
    )
}
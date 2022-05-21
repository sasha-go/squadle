const PORT = 8000;
const axios = require("axios");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());

app.get('/word', (req, res) => {
    const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
    params: {count: '6', wordLength: '6'},
    headers: {
        'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY
    }
    };

    axios.request(options).then((response) => {
        res.json(response.data[0]);
    }).catch((error) => {
        console.error(error);
    });
})

app.get('/check', (req, res) => {
    const word = req.query.word;

    const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: {entry: word},
    headers: {
        'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY
        }
    };

    axios.request(options).then((response) => {
        console.log(response.data);
        res.json(response.data.result_code)
    }).catch((error) => {
        console.error(error);
    })
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));

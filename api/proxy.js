const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.all('/*', async (req, res) => {
    const targetUrl = 'https://jsonplaceholder.typicode.com' + req.url;

    if (!targetUrl) {
        return res.status(400).send('Target URL is missing.');
    }

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: undefined,
                connection: undefined,
            },
            data: req.body,
            timeout: 10000 
        });

        res.status(response.status);

        Object.keys(response.headers).forEach(key => {
            if (!['access-control-allow-origin', 'access-control-allow-methods'].includes(key.toLowerCase())) {
                res.setHeader(key, response.headers[key]);
            }
        });

        res.send(response.data);
    } catch (error) {
        res.status(500).send('Proxy request failed.');
    }
});

module.exports = app;

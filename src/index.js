require('newrelic');
const express = require('express');
const http = require('http');
const { client } = require('./redis');
const { getActorsByTitle } = require('../src/service/database.service')
const { getClient } = require('../src/pg')
var bodyParser = require('body-parser')
// const { Server } = require('socket');

const app = express();

require('dotenv').config();

const logger = (req,res,next) => {
    console.log(`${req.url} a ${req.method} is called`);
    console.info(`${req.url} a ${req.method} is called`);
    next();
}

app.use(logger);

app.use(bodyParser.json());

const newServer = http.createServer(app);

const PORT = 3008;

app.get('/', (req,res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/setRedisWithExpiry', async (req,res) => {
    const obj = req.body;
    await client.set(obj.name, JSON.stringify(obj) ,{
        EX: req.headers.expiry,
        NX: true
      });
    res.send('Success');
});

app.get('/getRedisData', async (req,res) => {
    const name = req.query.name;
    const response = await client.get(name);
    res.send(response);
});

app.get('/getActorsByTitle', async (req,res) => {
    const { title } = req.query;
    const response = await getActorsByTitle(title);
    res.send(response);
});

newServer.listen(PORT, '0.0.0.0', async(error)=> {
    if(error){
        console.log('Failed to start server');
        console.info('Failed to start server');
    }
   else{
       await client.connect();
    //    await getClient();
       console.log(`Server running on port ${PORT}`);
       console.info(`Server running on port ${PORT}`);
   }
});

process.on('SIGTERM', async () => {
    console.info('SIGTERM signal received.');
    console.log('Gracefully Shutting down the server.');
    newServer.close(() => {
      console.log('Http server closed.');
    });
    client.quit().then(() => {
        console.log("Redis connection closed.");
      }).catch((err) => {
        console.error("Error closing Redis connection:", err);
    });
});
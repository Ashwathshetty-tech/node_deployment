const { client } = require('../redis');

async function setRedisWithExpiry(key,value,expiry){
    await client.set(key, JSON.stringify(value) ,{
        EX: expiry,
        NX: true
    });
}

async function getRedisData(key){
    return client.get(key);
}

module.exports = {
    setRedisWithExpiry,
    getRedisData
}
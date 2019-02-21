const fs = require('fs');
if (fs.existsSync('./.env.local')) {
    module.exports = require('dotenv').config({path: './.env.local'});
} else if (fs.existsSync('./.env')) {
    module.exports = require('dotenv').config({path: './.env'});
} else {
    console.error('.env or .env.local not found, please create it');
    exit(1);
}
const dotenv = require('dotenv');
dotenv.config();

var config = {
    server: process.env.SERVER,
    wallet: {
        address: process.env.WALLET_ADDRESS,
        secret: process.env.WALLET_SECRET
    }
};

module.exports = config;
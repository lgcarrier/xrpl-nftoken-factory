const dotenv = require('dotenv');
dotenv.config();

var config = {
    server: {
        name: process.env.SERVER_NAME,
        address: process.env.SERVER_ADDRESS,
    },
    wallet: {
        address: process.env.WALLET_ADDRESS,
        secret: process.env.WALLET_SECRET
    },
    pinataCloud: {
        apiKey: process.env.PINATA_CLOUD_API_KEY,
        apiSecret: process.env.PINATA_CLOUD_API_SECRET,
        jwt: process.env.PINATA_CLOUD_JWT
    },
    ipfs: {
        desiredGatewayPrefix: process.env.IPFS_DESIRED_GATEWAY_PREFIX
    }
};

module.exports = config;
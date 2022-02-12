const dotenv = require('dotenv');
dotenv.config();

var config = {
    server: {
        name: process.env.XRPL_SERVER_NAME,
        address: process.env.XRPL_SERVER_ADDRESS,
    },
    wallet: {
        address: process.env.XRPL_WALLET_ADDRESS,
        secret: process.env.XRPL_WALLET_SECRET
    },
    pinataCloud: {
        apiKey: process.env.PINATA_CLOUD_API_KEY,
        apiSecret: process.env.PINATA_CLOUD_API_SECRET,
        jwt: process.env.PINATA_CLOUD_JWT
    },
    ipfs: {
        desiredGatewayPrefix: process.env.IPFS_DESIRED_GATEWAY_PREFIX
    },
    trading: {
        createSellOffer: process.env.XRPL_CREATE_SELL_OFFERS === "true"
    },
    // xumm: {
    //     apiKey: process.env.XUMM_APIKEY,
    //     apiSecret: process.env.XUMM_APISECRET
    // },
    coveo: {
        enablePush: process.env.COVEO_ENABLE_PUSH === "true",
        apiKey: process.env.COVEO_PUSH_API_KEY,
        orgId: process.env.COVEO_ORG_ID,
        sourceId: process.env.COVEO_SOURCE_ID
    }
};

module.exports = config;
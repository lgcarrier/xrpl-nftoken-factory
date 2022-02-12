const xrpl = require('xrpl');

const config = require('../../config/config');
const logger = require('./loggerService');

//**********************************
//** Sell/Buy Offers ***************
//**********************************

module.exports = {
    getSellOffers: async function (token) {
        const wallet = xrpl.Wallet.fromSeed(config.wallet.secret);
        const client = new xrpl.Client(config.server.address);
        await client.connect();

        logger.info(`Fetching NFToken sell offers...`);

        let nftSellOffers;
        try {
            nftSellOffers = await client.request({
                method: "nft_sell_offers",
                tokenid: token.tokenID
            })
        } catch (err) {
            logger.info("No sell offers.")
        }
        logger.info(JSON.stringify(nftSellOffers, null, 2));

        logger.info(`NFToken fetched.`);

        client.disconnect();

        return nftSellOffers;
    }

}


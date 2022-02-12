// In browsers, use a <script> tag. In Node.js, uncomment the following line:
// const xrpl = require('xrpl');

const config = require('./config/config');
const nftokens = require('./nftokens/nftokens');
const logger = require('./src/js/loggerService');
const mintToken = require('./src/js/mintToken');
const createSellOffer = require('./src/js/createSellOffer');
const getOffers = require('./src/js/getOffers');
const createIpfs = require('./src/js/createIpfs');
const coveo = require('./src/js/pushToCoveoIndex');

async function main() {
    // XRPL information
    logger.info(`Minting NFTokens on XRPL Server: ${config.server.name} - ${config.server.address} `);
    logger.info(`Targetted XRPL wallet: ${config.wallet.address}`);
    logger.info(`Explore wallet using https://nft-devnet.xrpl.org/accounts/${config.wallet.address}`);
    logger.info(`Explore wallet using https://xls20.bithomp.com/explorer/${config.wallet.address}`);
    if (config.trading.createSellOffer) {
        logger.info('Individual NFToken sell offers will be created if configured.');
    }
    
    // Coveo information
    if (config.coveo.enablePush) {
        logger.info(`Pushing NFTokens to Coveo org id: ${config.coveo.orgId}`);
    }
    
    logger.info(`Minting NFTokens process starting...`);

    const tokens = nftokens.tokens;

    for (const token of tokens) {
        logger.info(`Processing NFToken...`);

        if (token.sourcePath) {
            const cid = await createIpfs.pinFromFS(token);
            logger.debug('cid', cid);

            token.uri = `ipfs://${cid}`;
        }
        const mintedToken = await mintToken.mintToken(token);

        if (config.coveo.enablePush) {
            const pushToCoveoIndex = await coveo.pushToCoveoIndex(mintedToken);
        }

        if (config.trading.createSellOffer && token.createSellOffer) {
            const createdSellOffer = await createSellOffer.createSellOffer(mintedToken);
            // const sellOffers = await getOffers.getSellOffers(mintedToken);
        }

        logger.info(`NFToken processed.`);
    }

    logger.info(`Minting NFTokens process completed.`);
}

main()
const config = require('../../config/config');
const logger = require('./loggerService');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(config.pinataCloud.apiKey, config.pinataCloud.apiSecret);

module.exports = {
    testAuthentication: function () {
        pinata.testAuthentication().then((result) => {
            //handle successful authentication here
            logger.info(result);
        }).catch((err) => {
            //handle error here
            logger.error(err);
        });
    },
    pinFromFS: async function (token) {
        logger.info('Pinning IPFS...');
        const sourcePath = token.sourcePath;
        // TODO::LGCARRIER
        // implement the following metadata structure: https://docs.ipfs.io/how-to/best-practices-for-nft-data/#metadata
        const options = {
            pinataMetadata: {
                name: token.name,
                keyvalues: {
                    'memo': token.memo
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        var cid = '';
        await pinata.pinFromFS(sourcePath, options).then((result) => {
            //handle results here
            // logger.info('pinFromFS response:');
            // logger.info(result);
            cid = result.IpfsHash;
        }).catch((err) => {
            //handle error here
            logger.debug(err);
        });
        // logger.info(`pinFromFS cid: ${cid}`);

        logger.info('IPFS pinned.');

        return cid;

    }
}
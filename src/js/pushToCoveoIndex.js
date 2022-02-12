const logger = require('./loggerService');
const config = require('../../config/config');
const {Source, DocumentBuilder} = require('@coveo/push-api-client');

module.exports = {
    pushToCoveoIndex: async function (token) {
        const source = new Source(config.coveo.apiKey, config.coveo.orgId);

        const myDocument = new DocumentBuilder(
            token.uri,
            token.name
        )
            .withDate(token.metadata.date)
            .withAuthor(token.metadata.author)
            .withClickableUri(token.convertedGatewayUrl || token.uri)
            .withData(token.memo)
            .withMetadata({
                tags: token.metadata.tags || [],
                externaluri: token.metadata.externaluri || '',
                walletaddress: config.wallet.address,
                walletaddressexploreruri: `https://nft-devnet.xrpl.org/accounts/${config.wallet.address}`
            });

        logger.info('Pushing document to Coveo index...');

        // logger.info(myDocument);

        const document = await source.addOrUpdateDocument(config.coveo.sourceId, myDocument);

        logger.info('Document pushed to Coveo.');

        return document;
    }

}
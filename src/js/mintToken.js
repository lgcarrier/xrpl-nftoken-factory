const xrpl = require('xrpl');
const config = require('../../config/config');
const logger = require('./loggerService');
const IPFSGatewayTools = require('@pinata/ipfs-gateway-tools/dist/node');
const gatewayTools = new IPFSGatewayTools();
const fastArrayDiff = require("fast-array-diff");

const compareNonFungibleTokensArrays = function (arrayA, arrayB) {
	return (
		arrayA.NonFungibleToken.TokenID === arrayB.NonFungibleToken.TokenID &&
		arrayA.NonFungibleToken.URI === arrayB.NonFungibleToken.URI
	);
}

const getMintedTokenID = function (affectedNodes) {
	// logger.info("Affected Nodes:");
	// logger.info(affectedNodes);

	// Get the generated TokenID
	var tokenID = '';

	// var firstCreated = affectedNodes.find(node => node.CreatedNo === 'Amsterdam');

	if (affectedNodes[0].CreatedNode || affectedNodes[1].CreatedNode) {
		logger.info("A first NFToken created with TokenID=");
		var createdNode = affectedNodes[0].CreatedNode || affectedNodes[1].CreatedNode;
		tokenID = createdNode.NewFields.NonFungibleTokens[0].NonFungibleToken.TokenID;
		logger.info(tokenID);
	}
	else {
		var modifiedNode = undefined;
		if (affectedNodes[0].ModifiedNode.LedgerEntryType=="NFTokenPage") {
			modifiedNode = affectedNodes[0].ModifiedNode;
		} else if (affectedNodes[1].ModifiedNode.LedgerEntryType=="NFTokenPage") {
			modifiedNode = affectedNodes[1].ModifiedNode;
		}

		// logger.info('PreviousFields=');
		// logger.info(modifiedNode.PreviousFields.NonFungibleTokens);
		
		// logger.info('FinalFields=');
		// logger.info(modifiedNode.FinalFields.NonFungibleTokens);


		var result = fastArrayDiff.diff(
			modifiedNode.PreviousFields.NonFungibleTokens,
			modifiedNode.FinalFields.NonFungibleTokens,
			compareNonFungibleTokensArrays
		);

		logger.info("Another NFToken created with TokenID=");
		tokenID = result.added[0].NonFungibleToken.TokenID;
		logger.info(tokenID);
	}
	
	return tokenID;
}

//***************************
//** Mint Token *************
//***************************
module.exports = {
	mintToken: async function (token) {
		const wallet = xrpl.Wallet.fromSeed(config.wallet.secret);
		const client = new xrpl.Client(config.server.address);
		await client.connect();
		logger.info(`Minting NFToken...`);

		const transactionBlob = {
			TransactionType: "NFTokenMint",
			Account: wallet.classicAddress,
			URI: xrpl.convertStringToHex(token.uri),
			Flags: parseInt(token.flags),
			TokenTaxon: 0, //Required, but if you have no use for it, set to zero.
			"Memos": [
				{
					"Memo": {
						"MemoData": xrpl.convertStringToHex(token.memo)
					}
				}
			]
		}
		// Submit signed blob --------------------------------------------------------
		const tx = await client.submitAndWait(transactionBlob, { wallet });

		// Check transaction results -------------------------------------------------
		logger.info("Transaction result:");
		logger.info(tx.result.meta.TransactionResult);

		token.tokenID = getMintedTokenID(tx.result.meta.AffectedNodes);

		// logger.info(`NFToken minted:`);
		// logger.info(token);

		const uriCID = gatewayTools.containsCID(token.uri);
		if (uriCID.containsCid) {
			const sourceUrl = token.uri;
			const desiredGatewayPrefix = config.ipfs.desiredGatewayPrefix;
			const convertedGatewayUrl = gatewayTools.convertToDesiredGateway(sourceUrl, desiredGatewayPrefix);
			logger.debug(`IPFS Gateway: ${convertedGatewayUrl}`);
			token.convertedGatewayUrl = convertedGatewayUrl;
		}

		client.disconnect();

		logger.info(`NFToken minted.`);

		return token;
	} //End of mintToken
}
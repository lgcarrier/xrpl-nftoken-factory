const xrpl = require('xrpl');

const config = require('../../config/config');

const IPFSGatewayTools = require('@pinata/ipfs-gateway-tools/dist/node');
const gatewayTools = new IPFSGatewayTools();


//***************************
//** Mint Token *************
//***************************
module.exports = {
	mintToken: async function (token) {
		const wallet = xrpl.Wallet.fromSeed(config.wallet.secret);
		const client = new xrpl.Client(config.server.address);
		await client.connect();
		console.log(`Minting NFToken...`);

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
		console.log("Transaction result:", tx.result.meta.TransactionResult);
		console.log(`NFToken minted:`, token);

		const uriCID = gatewayTools.containsCID(token.uri);
		if (uriCID.containsCid) {
			const sourceUrl = token.uri;
			const desiredGatewayPrefix = config.ipfs.desiredGatewayPrefix;
			const convertedGatewayUrl = gatewayTools.convertToDesiredGateway(sourceUrl, desiredGatewayPrefix);
			console.log(`IPFS Gateway: ${convertedGatewayUrl}`);
		}

		client.disconnect()
	} //End of mintToken
}
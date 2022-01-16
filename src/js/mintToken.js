const xrpl = require('xrpl');

const config = require('../../config/config');


//***************************
//** Mint Token *************
//***************************
module.exports = {
	mintToken: async function (token) {
		const wallet = xrpl.Wallet.fromSeed(config.wallet.secret)
		const client = new xrpl.Client(config.server)
		await client.connect()
		console.log("Connected to Sandbox")

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
		const tx = await client.submitAndWait(transactionBlob, { wallet })

		const nfts = await client.request({
			method: "account_nfts",
			account: wallet.classicAddress
		})
		console.log(nfts)

		// Check transaction results -------------------------------------------------
		console.log("Transaction result:", tx.result.meta.TransactionResult)
		console.log("Balance changes:",
			JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
		client.disconnect()
	} //End of mintToken
}
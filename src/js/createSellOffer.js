const xrpl = require('xrpl');

const config = require('../../config/config');
const logger = require('./loggerService');

//**********************************
//** Create Sell Offer *************
//**********************************

module.exports = {
	createSellOffer: async function (token) {
		const wallet = xrpl.Wallet.fromSeed(config.wallet.secret);
		const client = new xrpl.Client(config.server.address);
		await client.connect();
		logger.info(`Creating sell offer...`);

		const transactionBlob = {
			TransactionType: "NFTokenCreateOffer",
			Account: wallet.classicAddress,
            TokenID: token.tokenID,
            Amount: xrpl.xrpToDrops(token.createSellOfferAmount),
			Flags: parseInt(1)
		}
		// Submit signed blob --------------------------------------------------------
		const tx = await client.submitAndWait(transactionBlob, { wallet });
		
		// Check transaction results -------------------------------------------------
		// logger.info("Transaction result:", tx.result.meta.TransactionResult);
		// logger.info(`NFToken sell offer created:`, token);

		client.disconnect();

		logger.info(`Sell offer created.`);

		return token;
	} //End of createSellOffer
}

//***************************
//** Get Tokens *************
//***************************

async function getTokens() {
	const wallet = xrpl.Wallet.fromSeed(secret.value)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Sandbox")
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress
	})
	console.log(nfts)
	client.disconnect()
} //End of getTokens
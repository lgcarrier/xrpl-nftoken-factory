// In browsers, use a <script> tag. In Node.js, uncomment the following line:
// const xrpl = require('xrpl');

const config = require('./config/config');
const nftokens = require('./nftokens/nftokens');
const mintToken = require('./src/js/mintToken');
const createIpfs = require('./src/js/createIpfs');


// Wrap code in an async function so we can use await
async function main() {
    console.log(`XRPL Server: ${config.server.name} - ${config.server.address} `);
    console.log(`Minting NFTokens to address: ${config.wallet.address}`);
    console.log(`https://nft-devnet.xrpl.org/accounts/${config.wallet.address}`);
    console.log(`https://xls20.bithomp.com/explorer/${config.wallet.address}`);

    console.log(`Minting NFTokens process starting...`);

    const tokens = nftokens.tokens;

    for (const token of tokens) {
        if (token.sourcePath) {
            const cid = await createIpfs.pinFromFS(token);
            console.log('cid', cid);

            token.uri = `ipfs://${cid}`;
            
        }
        const mintedToken = await mintToken.mintToken(token);
    }

    console.log(`Minting NFTokens process completed.`);
}

main()
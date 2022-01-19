const config = require('../../config/config');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(config.pinataCloud.apiKey, config.pinataCloud.apiSecret);

module.exports = {
    testAuthentication: function () {
        pinata.testAuthentication().then((result) => {
            //handle successful authentication here
            console.log(result);
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    },
    pinFromFS: async function (token) {
        console.log('start pinFromFS');
        const sourcePath = token.sourcePath;
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
            // console.log(result);
            console.log('pinFromFS result',result);
            cid = result.IpfsHash;
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
        console.log('pinFromFS cid', cid);
        return cid;

    }
}
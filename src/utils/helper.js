const ethUtils = require('ethereumjs-util');

const generateNonce = () => {
    const nonce = Math.floor(Math.random() * 10000);
    return nonce;
};

const signatureVerification = (publicAddress, nonce, signature) => {
    const msg = `I'm signing my one time nonce ${nonce}`;
    // const msgBuffer = ethUtils.toBuffer(msg);
    const msgBuffer = new Buffer(msg);
    const msgHash = ethUtils.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtils.toBuffer(signature);
    const signatureParams = ethUtils.fromRpcSig(signatureBuffer);
    const publicKey = ethUtils.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
    const addressBuffer = ethUtils.publicToAddress(publicKey);
    const address = ethUtils.bufferToHex(addressBuffer);

    return address.toLowerCase() === publicAddress.toLowerCase();
}

module.exports = { generateNonce, signatureVerification };
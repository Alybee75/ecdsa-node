const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const fs = require('fs');
const { sign } = require("crypto");

function generatePrivateKey(){
    return secp.secp256k1.utils.randomPrivateKey();
}

function getPublicKey(privateKey) {
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    return publicKey;
}

function getAddress(publicKey) {
    let firstByte = publicKey.slice(1);
    let rest = keccak256(firstByte);

    let end = rest.length;
    let start = end - 20;
    return rest.slice(start, end);
}

async function addUsers(num) {
    const balances = {};
    let logData = '';

    if (fs.existsSync('./scripts/output.txt') && fs.statSync('./scripts/output.txt').size > 0) {
        fs.truncateSync('./scripts/output.txt', 0);
    }

    for (let i = 0; i < num; i++) {
        let priv = generatePrivateKey();
        let pub = getPublicKey(priv);
        let add = getAddress(pub);

        logData += `User: ${i+1}\n`;
        logData += `PRIVATE KEY: ${toHex(priv)}\n`;
        logData += `PUBLIC KEY: ${toHex(pub)}\n`;
        logData += `ADDRESS KEY: ${toHex(add)}\n\n`;

        let addressKey = toHex(add);
        let balance = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

        balances[addressKey] = balance;
    }

    fs.writeFileSync('./scripts/output.txt', logData, 'utf8');

    return balances;
}

function hashMessage(message) {
    let bytes = utf8ToBytes(message);
    let hash = keccak256(bytes);
    
    return hash;
}

async function verifyAddress(message, signature) {
    let hash = hashMessage(message);

    let pub = await signature.recoverPublicKey(hash).toRawBytes();

    const isValid = await secp.secp256k1.verify(signature, hash, pub);

    return isValid;
}

module.exports = {addUsers, getAddress, getPublicKey, verifyAddress};
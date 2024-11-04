import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function hashMessage(message) {
    let bytes = utf8ToBytes(message);
    let hash = keccak256(bytes);
    
    return hash;
}

async function signMessage(msg, priv) {
    let hash = hashMessage(msg);
  
    // const { signature, recoveryBit } = secp.secp256k1.sign(hash, priv, { recovered: true });
    // console.log("signature", signature, "recoveryBit", recoveryBit);
    // return { sign: signature, recoveryBit };

    const sign = secp.secp256k1.sign(hash, priv);
    console.log("signature", sign);
    return sign
 }
  

// Use export instead of module.exports for ES module
export { signMessage };

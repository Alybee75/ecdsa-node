const { addUsers, getAddress, getPublicKey, recoverAddress, verifyAddress } = require("./scripts/generate");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

const secp = require("ethereum-cryptography/secp256k1");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

let balances = {}; // Declare balances here

addUsers(5).then(result => {
  balances = result; // Assign the result to balances
  console.log(balances);
});

app.get("/balance/:priv", (req, res) => {
  const { priv } = req.params;
  
  let privByte = hexToBytes(priv);
  let pub = getPublicKey(privByte);
  let address = toHex(getAddress(pub));

  const balance = balances[address] || 0;
  res.send({ address, balance });
});

app.post("/send", (req, res) => {
  const { sign, address, amount, recipient } = req.body;

  console.log(req.body);

  let signature = new secp.secp256k1.Signature(BigInt(sign.r), BigInt(sign.s));
  signature = signature.addRecoveryBit(sign.recovery);

  console.log(signature);

  verifyAddress(amount.toString(), signature)
    .then((isValid) => {
      if (isValid) {
        console.log("verified");

        setInitialBalance(address);
        setInitialBalance(recipient);

        if (balances[address] < amount) {
          res.status(400).send({ message: "Not enough funds!" });
        } else {
          balances[address] -= amount;
          balances[recipient] += amount;
          res.send({ balance: balances[address] });
        }
      } else {
        console.log("invalid.");
        res.status(400).send({ message: "Invalid signature." });
      }
    })
    .catch((error) => {
      console.error("Error verifying address:", error);
      res.status(500).send({ message: "Internal server error." });
    });
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

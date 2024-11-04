import { useState } from "react";
import server from "./server";
import { signMessage } from "../scripts/generate.js"; // Make sure to use import

function Transfer({ priv, address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      signMessage(sendAmount, priv)
      .then((signature) => {

        const sign = {
          r: signature.r.toString(),
          s: signature.s.toString(),
          recovery: signature.recovery,
        };

        return server.post(`send`, {
          sign: sign,
          address: address,
          amount: parseInt(sendAmount),
          recipient,
        });
      })
      .then((response) => {
        const { balance } = response.data;
        setBalance(balance);
      })
      .catch((ex) => {
        if (ex.response) {
          alert(ex.response.data.message);
        } else {
          alert("An error occurred: " + ex.message);
        }
      });
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

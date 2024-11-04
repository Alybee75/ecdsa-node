import server from "./server";

function Wallet({ priv, setPriv, balance, setBalance, address, setAddress}) {
  async function onChange(evt) {
    const priv = evt.target.value;
    setPriv(priv);

    if (priv) {
      const {
        data: { address, balance },
      } = await server.get(`balance/${priv}`);

      setAddress(address);
      setBalance(balance);
    } else {
      setAddress("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <div className="address">Address: {address}</div>

      <label>
        Private Key
        <input placeholder="Type your Private Key" value={priv} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [priv, setPriv] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        priv={priv}
        setPriv={setPriv}
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} priv={priv} address={address} />
    </div>
  );
}

export default App;

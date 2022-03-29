import React, { useState } from "react";
import Loginbutton from "./mini/loginbutton"
import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

const Tezos = new TezosToolkit('https://hangzhounet.smartpy.io');
const wallet = new BeaconWallet({ name: "ooonus" });

Tezos.setWalletProvider(wallet);

function Mint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState([]);

  const getWallet = (address) => {
    //function from login button, gives active users wallet address

  
  }


  async function enactMint() {

    //todo here, create metadata based on input data 
    //send metadata to ipfs, 
    //get cid and set as ipfscid

    let ipfscid = "ipfs://QmY3TEGnS2v3y57rHN6jPc7zjQY7o171gAwE38iGcqW5mX?filename=newbn.json"
    const encoded = new Buffer(ipfscid).toString('hex');

    //double check wallet exists,if not send requ
    const address = await wallet.getPKH();
    if (!address) {
      //send an error, not logged in
      await wallet.requestPermissions();
    }

    const contract = await Tezos.wallet.at(
      "KT1MuEV7rPVMV4LJGwN2C1pFnZp9twgteZWN"
    );

    const activeAccount = await wallet.client.getActiveAccount();
    const metaMap = MichelsonMap.fromLiteral({
      "": encoded,
    });

    const result = await contract.methods
      .mint([
        {
          metadata:metaMap,
          to_: activeAccount.address,

        },
      ])
      .send();

    // As soon as the operation is broadcast, you will receive the operation hash
    return result.opHash;
  }


  return (
    <div className="mint">
       <Loginbutton getWallet={getWallet} />
      <h1 >mint</h1>

      <label>Image:
        <input
          type="file"
          accept="image/*"
          value={file}
          onChange={(e) => setFile(e.target.value[0])}
        />
      </label>
      <br />

      <label>Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label>Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      
      <br />
      <button onClick={() => enactMint()}>Mint</button>

    </div>
  );
}

export default Mint;
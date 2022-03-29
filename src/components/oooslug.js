import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loginbutton from "./mini/loginbutton"
import Axios from 'axios';
import "../App.css"
import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";



function Oooslug() {
  const Tezos = new TezosToolkit('https://hangzhounet.smartpy.io');
  const wallet = new BeaconWallet({ name: "ooonus" });
  Tezos.setWalletProvider(wallet);

  let { Slug } = useParams();
  const [currentToken, setCurrentToken] = useState([]);
  const [tokenOwner, setTokenOwner] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [price, setPrice] = useState();

  let contractaddress = "KT1MuEV7rPVMV4LJGwN2C1pFnZp9twgteZWN"
  let marketAddress = "KT1NWo68iev8VdyEJ1bQNRitb1UCCCDyE7xY"
  let network = "hangzhou2net"

  async function getTokens() {


    let api = `https://api.better-call.dev/v1/tokens/${network}/metadata`

    Axios.get(api, { params: { contract: contractaddress, token_id: Slug } })
      .then(response => {
        let da = {
          creator: response.data[0].creators[0],
          displayurl: getImageLinks(response.data[0].display_uri),
          thumbnail: getImageLinks(response.data[0].thumbnail_uri),
          token_id: response.data[0].token_id,
          title: response.data[0].name,
          description: response.data[0].description,
        }

        setCurrentToken(da);
      }).catch(e => console.log("api error", e))

    let api2 = `https://api.better-call.dev/v1/contract/${network}/${contractaddress}/tokens/holders`
    Axios.get(api2, { params: { token_id: Slug } })
      .then(response => {
        setTokenOwner(Object.keys(response.data)[0])
      }).catch(e => console.log("api error", e))

  }
  function getImageLinks(decoded) {
    const ok = decoded.split("//")
    let datastr = "https://cloudflare-ipfs.com/ipfs/" + ok[1].toString()
    return (datastr)
  }

  useEffect(() => {
    // Fetch ooo using the postSlug
    getTokens()
  }, [Slug]);

  const getWallet = (address) => {
    setLoggedInUser(address)
  }
  async function checkLoggedIn() {
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      console.log("Already connected:", activeAccount.address);

    } else {
      console.log("Not connected!");
    }
  }

  async function listForSale() {
     //double check wallet exists,if not send requ
    checkLoggedIn()
   
    const contract = await Tezos.wallet.at(
      contractaddress
    );
    const marketcontract = await Tezos.wallet.at(
      marketAddress
    );

    //define entrypoint and parameters
    const batch = await Tezos.wallet.batch()
      .withContractCall(contract.methods
        .update_operators([
          {
            add_operator:
            {
              owner: tokenOwner,
              operator: marketAddress,
              token_id: parseInt(Slug),
            },
          },
        ]))
      .withContractCall(marketcontract.methods
        .swap(1,parseInt(price)*1000,parseInt(Slug)));

      console.log(batch)
    // As soon as the operation is broadcast, you will receive the operation hash
    const batchOp = await batch.send();
    console.log('Operation hash:', batchOp.hash);
    await batchOp.confirmation();
  }
  async function purchase(){
    
  }

  return (
    <div className="home">
      <div >
        <Loginbutton getWallet={getWallet} />
        <h1 className="mt-5">{currentToken.title}</h1>
        <h4 className="mb-5">{currentToken.description}</h4>
        <img className="bigimage" src={currentToken.displayurl} key={currentToken.token_id} alt="img" ></img>


        <h6 className="mb-5">owner : <a href={"/profile/" + tokenOwner}>{tokenOwner}</a></h6>
        <h6 className="mb-5">oooer : <a href={"/profile/" + currentToken.creator}>{currentToken.creator}</a></h6>

        {loggedInUser == tokenOwner && <div>
          <h1 >List</h1>

          <label>Price:
            <input
              type="text"
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <br />
          <button onClick={() => listForSale()}>List</button>

        </div>}



        {loggedInUser != tokenOwner && <div>
          <label>Price: </label>
          <button onClick={() => purchase()}>purchase</button>
          </div>}
        <p>

          on this page
          if owner
          show list/delist button w/price
          show burn button(only owner can burn)

          if not owner,
          shows buy option if available

          both
          shows purchase history, last price paid

        </p>

      </div>
    </div>
  );
}


export default Oooslug;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";

function Profile({getWallet}) {
//   const Tezos = new TezosToolkit("https://mainnet-tezos.giganode.io");
  const Tezos = new TezosToolkit('https://hangzhounet.smartpy.io');
  const wallet = new BeaconWallet({ name: "ooonus" });
  Tezos.setWalletProvider(wallet);

  let { Slug } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {

    checkLoggedIn()

  }, [Slug]);

  async function login() {
    try {
      console.log("Requesting permissions...");
      const permissions = await wallet.client.requestPermissions({
        // network: {
        //   type: NetworkType.MAINNET,
        //   rpcUrl: "https://mainnet-tezos.giganode.io/",
        // },
        network: {
            type: NetworkType.HANGZHOUNET,
            rpcUrl: "https://hangzhounet.smartpy.io",
          },
      });



      setUserAddress(permissions.address)
      //pass to parent
      getWallet(permissions.address)
      setLoggedIn(true)
      console.log("Got permissions:", permissions.address);
    } catch (error) {
      console.log("Got error:", error);
    }
  }


  async function checkLoggedIn() {
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      console.log("Already connected:", activeAccount.address);
      setUserAddress(activeAccount.address)
      //pass to parent
      getWallet(activeAccount.address)
      setLoggedIn(true)
    } else {
      console.log("Not connected!");
      setLoggedIn(false)
    }
  }


  async function logout() {
    console.log("logout")
 
    await wallet.clearActiveAccount();
   
    await wallet.client.clearActiveAccount().then(()=>{
      setLoggedIn(false)
      setUserAddress("")
      getWallet("none")
      window.location.reload();
    });
 
    //pass to parent
   
  }

  function LoginBut(props) {
    const isLoggedIn = props.isLoggedIn;
    if (!isLoggedIn) {
      return <button onClick={login}>login</button>;
    }
    return <button onClick={logout}>{userAddress} - Logout</button>;
  }


  return (
        <div>
          <LoginBut isLoggedIn={loggedIn} />
        </div>
    
  );
}

export default Profile;
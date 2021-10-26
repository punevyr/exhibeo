import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import infgif from './img/infloading.gif'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TezosToolkit } from "@taquito/taquito";
import { DAppClient, TezosOperationType } from "@airgap/beacon-sdk";

import MiddleEllipsis from "react-middle-ellipsis";
import styled from 'styled-components';
const Tezos = new TezosToolkit("https://mainnet-tezos.giganode.io");
const wallet = new DAppClient({ name: "Exhibeo" });



var objktArray = [];

Tezos.setWalletProvider(wallet);

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool,

}

const defaultProps = {
  navPosition: '',
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false
}
const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  hideNav,
  hideSignin,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {
  const [loading, setloading] = useState(false);
  const [notloggedin, setnotloggedin] = useState(true);
  const query = `
  query collectorGallery($address: String!) {
    hic_et_nunc_token_holder(where: {holder_id: {_eq: $address}, quantity: {_gt: "0"}, token: {supply: {_gt: "0"}}}, order_by: {id: desc}) {
      token {
        id
        artifact_uri
        display_uri
        thumbnail_uri
        timestamp
        mime
        title
        description
        supply
        token_tags {
          tag {
            tag
          }
        }
        creator {
          address
        }
        swaps(where: {status: {_eq: "0"}}, order_by: {price: asc}) {
          amount
          amount_left
          creator_id
          price
        }
      }
    }
  }
  `;


  async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
      "https://api.hicdex.com/v1/graphql",
      {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        })
      }
    );

    return await result.json();
  }
  var objktidArray = [];
  var linkarray = [];

  async function doFetch(wallet) {
    setloading(true)
    const { errors, data } = await fetchGraphQL(query, "collectorGallery", { "address": wallet });
    if (errors) {
      console.error(errors);
    }
    const result = data.hic_et_nunc_token_holder
    for (var i = 0; i < result.length; i++) {
      var link = result[i].token.display_uri.split('/')
      var linkstring = "https://ipfs.io/ipfs/" + link[2];
      linkarray[i] = linkstring
      var objkt = result[i].token.id
      objktidArray[i] = objkt
    }


    //console.log(objktidArray)
    await showImages(linkarray)
    console.log('loaded images')

    var posts = document.querySelectorAll('.images');
    imagesLoaded(posts, function () {
      loadmason()
      setloading(false)
      changeVisibility()
    });
    var posts2 = document.querySelectorAll('.images2');
    imagesLoaded(posts2, function () {
      loadmason()
    });

  }

  function showImages(imgArray) {

    for (var i = 0; i < imgArray.length; i++) {
      var div = document.createElement("div");
      div.className = "grid-item2"
      div.id = objktidArray[i]
      div.onclick = (function (opt) {
        return function () {
          imageClicked(opt);
        };
      })(div.id);

      div.style = "width: 33%;"
      document.getElementById("imageGallery2").appendChild(div);

      var img = new Image();
      img.src = imgArray[i]
      img.style = "width: 100%;"
      
      if (i < 20) {
        img.className = "images"
      }
      else {
        img.className = "images2"
      }
      var idd = objktidArray[i]

      document.getElementById(idd).appendChild(img);
    }
  }
  function loadmason() {
    var grid = document.querySelector('.grid2');
    new Masonry(grid, {
      itemSelector: '.grid-item2',
      percentPosition: true
    });
    console.log("masonry ran")
  }
  // Styling a regular HTML input
  const StyledInput = styled.input`
    border-top-style: hidden;
    border-right-style: hidden;
    border-left-style: hidden;
    border-bottom-style: groove;
    width: 25vw;
    text-align: center;
    margin: 0px auto;
    margin-top; 30px
    margin-top; 30px
    display: block;
    background-color: #000000;
    color: white;

`;
  const Styledp = styled.p`
border-top-style: hidden;
border-right-style: hidden;
border-left-style: hidden;
border-bottom-style: hidden;
width: 70vw;
text-align: center;
margin: 0px auto;
margin-top; 30px
margin-top; 30px
display: block;
background-color: #000000;
color: white;
font-size: medium;

`;
  const Styledb = styled.button`
border-top-style: groove;
border-right-style: groove;
border-left-style: groove;
border-bottom-style: groove;
width: 15vw;
text-align: center;
margin: 0px auto;
margin-top; 30px
margin-top; 30px
display: block;
background-color: #000000;
color: white;

`;

  function changeVisibility() {
    const vis = document.getElementById("imageGallery2").style.visibility;
    if (vis === 'hidden') {
      document.getElementById("imageGallery2").style.visibility = 'visible'
    }
  }

  useEffect(() => {
    //AKA onload
    const urllink = window.location.href.toString();
    const arrlink = urllink.split("?");
    const username = arrlink[1]
    if (!username) {
      setnotloggedin(true)
      checkWalletConnection();
    }
  }, [])

  const [walletModalActive, setWalletmodalactive] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setWalletmodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setWalletmodalactive(false);
  }


  const [walletAddress, setWalletAddress] = useState("");


  async function checkWalletConnection() {
    const activeAccount = await wallet.getActiveAccount();
    if (activeAccount) {
      setWalletAddress(activeAccount.address);
      setnotloggedin(false)
      doFetch(activeAccount.address)
    }
  }

  async function connectWallet() {

    const activeAccount = await wallet.getActiveAccount();

    if (activeAccount) {
      openModal();
    } else {
      try {
        //console.log("Requesting permissions...");
        const permissions = await wallet.requestPermissions();
        console.log("Got permissions:", permissions.address);
        //wallet connected
        setWalletAddress(permissions.address);
        doFetch(permissions.address);
        window.location.reload(false);
      } catch (error) {
        console.log("Got error:", error);
      }
    }

  }
  async function disconnectWallet() {

    await wallet.clearActiveAccount();
    window.location.reload(false);
  }


  function addToImageArray(id) {
    objktArray.push(id);
  }

  function removeFromImageArray(id) {
    var imgindex = objktArray.indexOf(id);
    objktArray.splice(imgindex, 1);
  }

  function showInstructions() {
    if (document.getElementById("instructions").style.display === "block") {
      document.getElementById("instructions").style.display = "none"
    } else {
      document.getElementById("instructions").style.display = "block"
    }

  }


  function imageClicked(id) {
    const clickedImage = document.getElementById(id);
    if (clickedImage.style.borderStyle === "dashed") {
      clickedImage.style.borderStyle = "none";
      removeFromImageArray(id);
    }
    else {
      clickedImage.style.border = "5px";
      clickedImage.style.borderColor = "white";
      clickedImage.style.borderStyle = "dashed";
      addToImageArray(id);
    }
  }
  async function usernameTaken(username) {
    const axios = require('axios')
    var taken = false
    await axios
      .get('https://api.better-call.dev/v1/contract/mainnet/KT1VTp8ZBBrScQmVVTZRoQE28gx4fMWTTW6b/storage', {
      })
      .then(res => {
        for (var i in res.data[0].children) {
          if (res.data[0].children[i].children[1].value === username) {
            if (res.data[0].children[i].name === walletAddress) {
              console.log("username belongs to owner")
              taken = false
            }
            else {
              console.log("username doesnt belong to owner")
              taken = true

            }
          }
        }
      })
      .catch(error => {
        console.error(error)
      })
    return taken

  }
  async function saveData() {
    var imga = objktArray.toString();
    const EXHIBEO_CONTRACT = "KT1VTp8ZBBrScQmVVTZRoQE28gx4fMWTTW6b";
    const username = document.getElementById("username").value;
    if (username === "") {
      document.getElementById("warningtext").innerHTML = "Username cannot be empty"
    }
    else if (imga === "") {
      document.getElementById("warningtext").innerHTML = "You cannot choose 0 images, select some images from below to display on your profile, then click save."
    }
    else {
      var userTaken = await usernameTaken(username)
      console.log(userTaken)
      if (userTaken) {
        document.getElementById("warningtext").innerHTML = "Username is already taken, if you believe this username already belongs to you, make sure you are using the same wallet as when you first created that username."
      } else if (!userTaken) {
        try {
          const result = await wallet.requestOperation({
            operationDetails: [
              {
                kind: TezosOperationType.TRANSACTION,
                destination: EXHIBEO_CONTRACT,
                amount: "0",
                parameters: {
                  entrypoint: "default",
                  value: {
                    prim: "Pair",
                    "args":
                      [
                        {
                          string: imga
                        },
                        {
                          string: username
                        }
                      ]
                  },
                },
              },
            ],
          });

          console.log(result);
          //show link
          var linka = "https://exhibeo.xyz/?" + username
          //document.getElementById("linkforprofile").setAttribute('href',linka) 

          var adiv = document.createElement("a");
          adiv.href = linka
          adiv.style = "text-decoration: underline;"
          adiv.innerHTML = "Link to your profile"
          document.getElementById("linkforprofile").appendChild(adiv);
        } catch (error) {
          console.log(
            `The contract call failed and the following error was returned:`
          );
          console.log(error);
        }
      }


    }
  }

  return (
    <section
    >
      {!walletModalActive && <div className="container">
        <div className={
          classNames(
            bottomDivider && 'has-bottom-divider'
          )}>
          {!hideNav &&
            <div >
              {!hideSignin &&
                <div
                >
                  <div style={{ paddingTop: "15px", paddingBottom: "15px", alignItems: "center", justifyContent: "center", display: "flex" }}>
                    {!walletAddress && <button style={{ display: 'inline-flex', color: 'white', backgroundColor: '#000000', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', float: 'right' }} onClick={connectWallet}>Sign in with wallet to customize</button>}
                    {walletAddress && <span style={{ display: 'inline-flex', color: 'white', backgroundColor: '#000000', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', float: 'right' }}><button style={{ maxWidth: '200px', fontWeight: 'light', display: 'inline-block', color: 'white', backgroundColor: '#000000', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', float: 'right' }} className="button button-primary button-wide-mobile button-sm" onClick={openModal}><MiddleEllipsis><span>{walletAddress}</span></MiddleEllipsis></button></span>}
                  </div>
                </div>}
            </div>
          }
        </div>
      </div>}
      {walletModalActive && <div style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#000000', paddingTop: 20, paddingBottom: 12, paddingLeft: 24 }} onClick={closeModal} className="container">
        <div style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', }}>Address: {walletAddress}</div>
        <div style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4, }}><button style={{ display: 'inline-block', color: 'white', backgroundColor: '#000000', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', }} className="button button-primary button-wide-mobile button-sm" onClick={disconnectWallet} >Logout</button></div>

      </div>}
      {walletAddress && <div style={{ paddingTop: "15px", paddingBottom: "15px", alignItems: "center", justifyContent: "center", display: "flex" }}>


        <div style={{ textAlign: "center" }}>
          <Styledp onClick={showInstructions} style={{ padding: "5px" }}>Enter a username and select the images you wish to display. For more detailed instructions <u>click here</u></Styledp>
          <div id="instructions" style={{ display: "none" }}>
            <Styledp style={{ padding: "5px" }}>STEPS</Styledp>
            <Styledp style={{ padding: "5px" }}><big>1</big>. Sign in with your wallet that contains the NFTs you wish to put in your exhibit</Styledp>
            <Styledp style={{ padding: "5px" }}><big>2</big>. Enter a username. This will be turned into the link for your account</Styledp>
            <Styledp style={{ padding: "5px" }}><big>3</big>. Select images you want to display on your profile. The images will be displayed in the order you select them.</Styledp>
            <Styledp style={{ padding: "5px" }}><big>4</big>. Click save, if the username is taken an error should appear.</Styledp>
            <Styledp style={{ padding: "5px" }}>Due to the data being stored on a smart contract, the saving will take place as a transaction with 0 fees (besides gas + storage if needed).</Styledp></div>
          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <StyledInput autoComplete="off" id="username"
              placeholder="Username"
            />
          </div>
          <p id="warningtext" style={{ padding: "10px", color: "red", fontSize: "xl" }}></p>
          <p><Styledb onClick={saveData} style={{ padding: "10px", minWidth: "100px" }}>Save</Styledb></p>
        </div>

      </div>}
      <div id="linkforprofile" style={{ padding: "10px", textAlign: "center" }}>
      </div>


      {loading && <div style={{ textAlign: "center", color: 'lightblue' }}>Loading images....speed dependent on your internet and nft amount. Please be patient<div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} ><img src={infgif} alt="loading..." /></div></div>}
      {notloggedin && <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} ><img src={infgif} alt="loading..." /></div>}
      <div id='imageGallery2' style={{ visibility: "hidden" }} className="grid2">
        <div className="grid-sizer"></div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
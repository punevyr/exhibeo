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
  const [linkshown, setlinkshown] = useState(false);
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

  async function doFetch(wallet) {
    setloading(true)
    console.log(loading)
    const { errors, data } = await fetchGraphQL(query, "collectorGallery", { "address": wallet });
    if (errors) {
      console.error(errors);
    }
    const result = data.hic_et_nunc_token_holder
    var linkarray = []
    for (var i = 0; i < result.length; i++) {
      var link = result[i].token.display_uri.split('/')
      var linkstring = "https://ipfs.io/ipfs/" + link[2];
      linkarray[i] = linkstring
      var objkt = result[i].token.id
      objktidArray[i] = objkt
    }


    //console.log(objktidArray)
    await showImages(linkarray)
    // showImages(result)
    console.log('loaded images')

    // imagesLoaded( document.querySelector('.images'), function( instance ) {
    //   loadmason()
    //   console.log('ran masonry')
    // });
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
      div.className = "grid-item"
      div.id = objktidArray[i]
      div.onClick = function () {
        imageClicked()
      }
      div.onclick = (function (opt) {
        return function () {
          imageClicked(opt);
        };
      })(div.id);

      div.style = "width: 33%;"
      document.getElementById("imageGallery").appendChild(div);

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
    var grid = document.querySelector('.grid');
    new Masonry(grid, {
      itemSelector: '.grid-item',
      percentPosition: true
    });

  }
  function isValid(address) {
    //var wallet = document.getElementById("wallet").value;
    console.log(address)
    if (address.length === 36) {
      doFetch(address)
    }
    else {
      const imageg = document.getElementById("imageGallery");
      imageg.innerHTML = "";
    }
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
    background-color: #272727;
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
background-color: #272727;
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
background-color: #272727;
color: white;

`;

  // Creating a custom hook
  // function useInput(defaultValue) {
  //   const [value, setValue] = useState(defaultValue);
  //   function onChange(e) {
  //     setValue(e.target.value);
  //     isValid(value);
  //   }
  //   return {
  //     value,
  //     onChange,
  //   };
  // }

  function changeVisibility() {
    const vis = document.getElementById("imageGallery").style.visibility;
    if (vis === 'hidden') {
      document.getElementById("imageGallery").style.visibility = 'visible'
    }
  }

  //const inputProps = useInput();
  const [isActive, setIsactive] = useState(false);
  const [usernam, setUsernam] = useState("");
  const nav = useRef(null);
  const hamburger = useRef(null);

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('click', clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    if (!walletModalActive) {
      document.body.classList.add('off-nav-is-active');
      nav.current.style.maxHeight = nav.current.scrollHeight + 'px';
      setIsactive(true);
    }

  }

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  }

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  }

  const clickOutside = (e) => {
    if (!nav.current) return
    if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  }


  useEffect(() => {
    // on load
    checkWalletConnection();

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
      //set button text to wallet address
      setWalletAddress(activeAccount.address);
      isValid(activeAccount.address);
      return activeAccount;
      //already connected wallet
    } else {
      return;
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
        isValid(permissions.address);
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

  //databas stuff

  function addToImageArray(id) {
    objktArray.push(id);
  }

  function removeFromImageArray(id) {

    var imgindex = objktArray.indexOf(id);
    objktArray.splice(imgindex, 1);
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
  async function saveData() {
    var imga = objktArray.toString();


    // const axios = require('axios')
    // axios
    //   .get('https://api.better-call.dev/v1/contract/mainnet/KT1Vdb1TGy5qJFhp8J67kZD25k4uBzJDrNHF', {
    //   })
    //   .then(res => {
    //     console.log(`statusCode: ${res.status}`)
    //     console.log(res)
    //   })
    //   .catch(error => {
    //     console.error(error)
    //   })
    const EXHIBEO_CONTRACT = "KT1Gxa6pzZm4BmNDZUePMM6xHYDbycfJj4jz";
    const username = "testusername";
    
   
    try {
      const result = await wallet.requestOperation({
        operationDetails: [
          {
            kind: TezosOperationType.TRANSACTION,
            destination: EXHIBEO_CONTRACT,
            amount:"0",
            parameters: {
              entrypoint: "default",
              value: {
                objktids: imga,
                username: username
              },
            },
          },
        ],
      });
    
      console.log(result);
    } catch (error) {
      console.log(
        `The contract call failed and the following error was returned:`
      );
      console.log(error);
    }
    //show link
    var linka = "https://exhibeo.xyz/account/?"+walletAddress
    //document.getElementById("linkforprofile").setAttribute('href',linka) 

    var adiv = document.createElement("a");
    adiv.href = linka
    adiv.style="text-decoration: underline;"
    adiv.innerHTML ="Link to your profile"
    document.getElementById("linkforprofile").appendChild(adiv);
    
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
                  {/* <div style={{ paddingTop: "50px" }}>
                      <StyledInput autoComplete="off" id="wallet"
                        {...inputProps}
                        placeholder="Xtz address, not domain .... e.g. (tz1w...c6za)"
                      />
                    </div> */}
                  <div style={{ paddingTop: "15px", paddingBottom: "15px", alignItems: "center", justifyContent: "center", display: "flex" }}>
                    {!walletAddress && <button style={{ display: 'inline-flex', color: 'white', backgroundColor: '#272727', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', float: 'right' }} onClick={connectWallet}>Sign in with wallet to customize</button>}
                    {walletAddress && <span style={{ display: 'inline-flex', color: 'white', backgroundColor: '#272727', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', float: 'right' }}><button style={{ maxWidth: '200px', fontWeight: 'light', display: 'inline-block', color: 'white', backgroundColor: '#272727', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', float: 'right' }} className="button button-primary button-wide-mobile button-sm" onClick={openModal}><MiddleEllipsis><span>{walletAddress}</span></MiddleEllipsis></button></span>}
                  </div>
                </div>}
            </div>
          }
        </div>
      </div>}
      {walletModalActive && <div style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#272727', paddingTop: 20, paddingBottom: 12, paddingLeft: 24 }} onClick={closeModal} className="container">
        <div style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', }}>Address: {walletAddress}</div>
        <div style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4, }}><button style={{ display: 'inline-block', color: 'white', backgroundColor: '#272727', fontWeight: 'light', border: 'solid', borderColor: 'white', borderTop: 'none', borderLeft: "none", borderRight: 'none', borderWidth: '2px', }} className="button button-primary button-wide-mobile button-sm" onClick={disconnectWallet} >Logout</button></div>

      </div>}
      {walletAddress && <div style={{ paddingTop: "15px", paddingBottom: "15px", alignItems: "center", justifyContent: "center", display: "flex" }}>

        <div style={{ textAlign: "center" }}>
          <Styledp style={{ padding: "10px" }}>Click the images you wish to display, in the order you wish to display them, then click save</Styledp>
          <p><Styledb onClick={saveData} style={{ padding: "10px", minWidth: "100px" }}>Save</Styledb></p>
        </div>

      </div>}
        <div id="linkforprofile" style={{ padding: "10px", textAlign: "center" }}>
    </div>


      {loading && <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} ><img src={infgif} alt="loading..." /></div>}
      <div id='imageGallery' style={{ visibility: "hidden" }} className="grid">
        <div className="grid-sizer"></div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
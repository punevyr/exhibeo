import React, { useState, useEffect } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import infgif from './img/infloading.gif'
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
  const [usernameGood, setUsernameGood] = useState(true);
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

//todo make it say emit sucks if he uses his username
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
    const { errors, data } = await fetchGraphQL(query, "collectorGallery", { "address": wallet });
    if (errors) {
      console.error(errors);
    }
    const result = data.hic_et_nunc_token_holder
    var linkarray = [] //array of ipfs links for the img divs
    for (var i = 0; i < result.length; i++) {
      var link = result[i].token.display_uri.split('/')
      var linkstring = "https://ipfs.io/ipfs/" + link[2];
      linkarray[i] = linkstring
      var objkt = result[i].token.id
      objktidArray[i] = objkt
    }
    await showImages(linkarray)

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
  function display(i,j,objkts,imgArray) {      
    var div = document.createElement("a");
    div.className = "grid-item"
    div.id = objkts[i]

    var linka = "https://www.hicetnunc.xyz/objkt/" + objkts[i]
    div.href = linka
    div.style = "width: 33%;"
    document.getElementById("imageGallery").appendChild(div);

    var img = new Image();
    img.src = imgArray[j]
    img.style = "width: 100%;"
    if (i < 20) {
      img.className = "images"
    }
    else {
      img.className = "images2"
    }
    var idd = objkts[i]

    document.getElementById(idd).appendChild(img);

  }

  function showImages(imgArray) {
    console.log(imgArray)
    var count = 0 
    const objkts = imagelist.split(",");
    for (var i=0; i < objkts.length; i++) {
      for (var j=0; j < objktidArray.length; j++) {
        if(objkts[i] == objktidArray[j]){
          display(i,j, objkts, imgArray)
          count = count + 1
        }
      }

    }

    if (count === 0) {
      window.location.href = "/";
      console.log("account page")
    }

    var elem = document.getElementsByClassName('grid-item');
    if (elem.length < 4) {
      for (var j = 0; j < elem.length; ++j) {
        var item = elem[j];
        item.style.width = "100%"
      }
    }

  }



  function loadmason() {
    var grid = document.querySelector('.grid');
    new Masonry(grid, {
      itemSelector: '.grid-item',
      percentPosition: true
    });

  }
  function changeVisibility() {
    const vis = document.getElementById("imageGallery").style.visibility;
    if (vis === 'hidden') {
      document.getElementById("imageGallery").style.visibility = 'visible'

    }
  }

  useEffect(() => {
    const urllink = window.location.href.toString();

    const arrlink = urllink.split("?");
    const username = arrlink[1]
    if (username) {
      getDatas(username)
    }
  }, [])

  async function isValid(wallet) {
    if (wallet.length === 36) {
      doFetch(wallet)
    }

  }
  var imagelist = ""//from get, list of images user wants to display

  function getDatas(username) {
    var good = false
    const axios = require('axios')
    axios
      .get('https://api.better-call.dev/v1/contract/mainnet/KT1DuiWewTe1NqexT9Jekes9Vk7TSbuxkNb9/storage', {
      })
      .then(res => {
        for (var i in res.data[0].children) {
          if (res.data[0].children[i].name === username) {
            imagelist = res.data[0].children[i].children[1].value
            good = true
            isValid(res.data[0].children[i].children[0].value)
          }
        }
        if(!good){
          setUsernameGood(false)
        }
      })
      .catch(error => {
        console.error(error)
      })

  }
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
  background-color: #00000;
  color: white;
  font-size: medium;
  
  `;
 
  return (

    <section
    >
   {!usernameGood && <div style={{ textAlign: "center" }}>
          <Styledp style={{ padding: "10px", paddingTop:"25px" }}>Invalid link/username</Styledp>
          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          </div>
          <p><a href="/"  style={{ padding: "10px", minWidth: "100px", textDecoration:"underline" }}>Click here to create an exhibit</a></p>
        </div>}
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
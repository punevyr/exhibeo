import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router";
import Loginbutton from "./mini/loginbutton"
import Axios from 'axios';



function Profile() {
  const [sectionOpen, setSectionOpen] = useState("owned");
  const [ownedTokens,setownedTokens] = useState([]);
  const [createdTokens,setcreatedTokens] = useState([]);
  let { Slug } = useParams();

  useEffect(() => {


  }, [Slug]);




  async function getTokens(address) {
    let contractaddress = "KT1MuEV7rPVMV4LJGwN2C1pFnZp9twgteZWN"
    let network = "hangzhou2net"
    let userAddress = address
    let api = `https://api.better-call.dev/v1/account/${network}/${userAddress}/token_balances`

    Axios.get(api, { params: { contract: contractaddress } })
      .then(response => {
        for (var i in response.data.balances) {
          console.log(response.data.balances[i])
          if(response.data.balances[i].creators[0] === userAddress){//if current logged in user created the token
            let da = {
              creator: response.data.balances[i].creators[0],
              diplayurl: getImageLinks(response.data.balances[i].display_uri),
              thumbnail: getImageLinks(response.data.balances[i].thumbnail_uri),
              token_id: response.data.balances[i].token_id,
              title: response.data.balances[i].name,
            }

            setcreatedTokens(prevItems => [...prevItems, da]);
          }else if(response.data.balances[i].balance ==1 ){// if current logged in user owns the token
            let da = {
              creator: response.data.balances[i].creators[0],
              diplayurl: getImageLinks(response.data.balances[i].display_uri),
              thumbnail: getImageLinks(response.data.balances[i].thumbnail_uri),
              token_id: response.data.balances[i].token_id,
              title: response.data.balances[i].name,
            }
            setownedTokens(prevItems => [...prevItems, da]);
          }else{
            console.log("no owned or created tokens")
          }

        }

      }).catch(e => console.log("api error", e))
    // console.log(ownedTokens, "owned")
    // console.log(createdTokens,"created")
  }



  function getImageLinks(decoded) {
    //gets initial metadata then the image link
    const ok = decoded.split("//")
    let datastr = "https://cloudflare-ipfs.com/ipfs/" + ok[1].toString()

    return (datastr)
  }


  const getWallet = (address) => {
    if(address!=="none"){
      getTokens(address)
    }
  
  }
  function goTo(id){
    window.location.href = "/ooo/"+id.toString();

  }


  return (
    <div className="profile">
      {!Slug && //if there is no slug load the profile page, 2 tabs owned, listings
        <div>
          <Loginbutton getWallet={getWallet} />
          <h1>profile</h1>
          <a href="/mint">mint</a>
          <div>
            <a style={ sectionOpen == "owned" ? { textDecoration:'underline',paddingRight:20} : {paddingRight:20}}  onClick={() => setSectionOpen("owned")}>owned</a>
            <a style={ sectionOpen == "created" ? { textDecoration:'underline',paddingRight:20} : {paddingRight:20}} onClick={() => setSectionOpen("created")}>created</a>
          </div>

          {sectionOpen === "owned" && <div>
          {ownedTokens.map((imgSrc, index) => (<img onClick={()=>goTo(imgSrc.token_id)} src={imgSrc.thumbnail} key={imgSrc.title} alt="img" ></img>))}
          
          </div>}

          {sectionOpen === "created" && 
          <div>
            {createdTokens.map((imgSrc, index) => (
            <div>
            <img onClick={()=>goTo(imgSrc.token_id)}  src={imgSrc.thumbnail} key={imgSrc.title} alt="img" ></img>
            <p>Title: {imgSrc.title}</p>
            <p>Creator: {imgSrc.creator}</p>
            
            </div>))}


          </div>}


        </div>
      }


      <Outlet />
    </div>
  );
}

export default Profile;
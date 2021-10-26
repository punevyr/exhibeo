import React, {useEffect} from 'react';
import $ from 'jquery';
// // import sections
import Account from '../components/sections/Account';
import Hero from '../components/sections/Hero';


const Home = () => {

  useEffect(() => {
    const urllink = window.location.href.toString();
    const arrlink = urllink.split("?");
    const username = arrlink[1] 

    if (username){
      console.log("username detected")
      $('#accountjq').hide();
      $('#herojq').show();
    }else{
      console.log("no username detected")
      $('#accountjq').show();
      $('#herojq').hide();
    }
  
  }, [])

  return (
    <>
      <div id="herojq"><Hero/></div>
      <div id="accountjq"><Account /></div>
    </>
  );
}

export default Home;
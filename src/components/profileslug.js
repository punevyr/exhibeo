import React, { useEffect } from "react";
import { useParams } from "react-router";

function ProfileSlug() {
  let { Slug } = useParams();

  useEffect(() => {
    // Fetch post using the postSlug
  }, [Slug]);

  return (
    <div className="home">
      <div >
        <h1 className="mt-5">Artists page</h1>
        <h6 className="mb-5">The artists address is id, {Slug}</h6>
        <p>
       display all art for sale by artist with id {Slug}
    clicking on a piece brings you to the ooo/slug page
        </p>
  
      </div>
    </div>
  );
}

export default ProfileSlug;
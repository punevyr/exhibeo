import React from "react";
import { Outlet } from "react-router-dom";

function Ooo() {
  return (
    <div className="ooo">
      <div >
      <Outlet />
      </div>
    </div>
  );
}

export default Ooo;
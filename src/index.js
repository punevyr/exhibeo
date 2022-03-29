import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
// import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  Ooo,
  Profile,
  Forum,
  Oooslug,
  ProfileSlug,
  Mint,
} from "./components";

ReactDOM.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ooo" element={<Ooo />}>
        <Route path=":Slug" element={<Oooslug />} />
      </Route>
      <Route path="/profile" element={<Profile />} >
        <Route path=":Slug" element={<ProfileSlug />} />
      </Route>
      <Route path="/forum" element={<Forum />} />
      <Route path="/mint" element={<Mint />} />
    </Routes>
    <Footer />
  </Router>,

  document.getElementById("root")
);

// serviceWorker.unregister();
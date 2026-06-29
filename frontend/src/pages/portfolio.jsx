import React from "react";
// import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Portfolio/Navbar";
import Hero from "../components/Portfolio/Hero";
import Page2 from "../components/Portfolio/page2";
import Page3 from "../components/Portfolio/page3";
import Page4 from "../components/Portfolio/page4";
import Page5 from "../components/Portfolio/page5";
import Page6 from "../components/Portfolio/page6";
import Page7 from "../components/Portfolio/page7";

import Footer from "../components/Portfolio/footer";
import "../components/Portfolio/Global.css";

function Portfolio() {
  return (
    <>
      <Navbar></Navbar>
      <Hero></Hero>
      <Page2></Page2>
      <Page3></Page3>
      <Page4></Page4>
      <Page5></Page5>
      <Page6></Page6>
      <Page7></Page7>
      <Footer></Footer>
    </>
  );
}

export default Portfolio;

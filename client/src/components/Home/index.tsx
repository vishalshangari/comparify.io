import React from "react";
import PersonalData from "../PersonalData";
import Footer from "../shared/Footer";

const Home = () => {
  document.title = `Home | Comparify`;
  return (
    <>
      <PersonalData></PersonalData>
      <Footer />
    </>
  );
};

export default Home;

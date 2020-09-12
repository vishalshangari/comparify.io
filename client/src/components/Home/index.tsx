import React from "react";
import { Helmet } from "react-helmet";
import PersonalData from "../PersonalData";
import Footer from "../shared/Footer";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Comparify - Home</title>
      </Helmet>
      <PersonalData></PersonalData>
      <Footer />
    </>
  );
};

export default Home;

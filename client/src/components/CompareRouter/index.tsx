import React, { useEffect, useState } from "react";
import fetchUserSavedData from "../../utils/fetchUserSavedData";
import Header from "../shared/Header";
import Footer from "../shared/Footer";

const CompareRouter = () => {
  const [
    userAlreadyHasComparifyPage,
    setUserAlreadyHasComparifyPage,
  ] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkIfUserHasComparifyPage = async () => {
      const userData = await fetchUserSavedData();
      if (userData.comparifyPage.exists) {
        setUserAlreadyHasComparifyPage(userData.comparifyPage.ref);
        setIsLoading(false);
      } else {
        setUserAlreadyHasComparifyPage(`doesn't exist!! loooool`);
        setIsLoading(false);
      }
    };
    checkIfUserHasComparifyPage();
  }, []);
  return (
    <>
      <Header standardNav />
      isLoading ? (<div>loading...</div>) : (
      <div>{userAlreadyHasComparifyPage}</div>
      );
      <Footer />
    </>
  );
};

export default CompareRouter;

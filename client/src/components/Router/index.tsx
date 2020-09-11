import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import Home from "../../components/Home";
import Splash from "../../components/Splash";
import { useAuthState } from "../../App";
import { RESPONSE_CODES } from "../../constants";
import AuthenticatedCreateComparePage from "../AuthenticatedCreateComparePage";
import AuthenticatedComparePage from "../compare/AuthenticatedComparePage";
import UnauthenticatedComparePage from "../compare/UnauthenticatedComparePage";
import FourZeroFour from "../FourZeroFour";
import UnauthenticatedCreateComparePage from "../UnauthenticatedCreateComparePage";
import Feedback from "../Feedback";
import PrivacyPolicy from "../PrivacyPolicy";
import { Helmet } from "react-helmet";

// Test components
// import Test from "../../Test";
// import Login from "../../components/Login";
// import TestPrivateRoute from "../TestPrivateRoute";
// import FormTest from "../FormTest";
// import CompareRouter from "../CompareRouter";

export interface PrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

const Router = () => {
  const { state: authState } = useAuthState();
  const isAuthenticated = authState.status === RESPONSE_CODES.AUTHENTICATED;

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          {isAuthenticated ? <Redirect to="/home" /> : <Splash />}
        </Route>
        <Route path="/home" exact>
          {isAuthenticated ? <Home /> : <Redirect to="/" />}
        </Route>
        <Route path="/compare" exact>
          <Helmet>
            <title>Compare | Comparify</title>
            <meta
              name="description"
              content="Create unique Comparify page to share with friends and compare taste in music."
            />
          </Helmet>
          {isAuthenticated ? (
            <AuthenticatedCreateComparePage />
          ) : (
            <UnauthenticatedCreateComparePage />
          )}
        </Route>
        <Route path="/feedback" exact component={Feedback} />
        <Route path="/privacy" exact component={PrivacyPolicy} />
        <Route path="/:comparifyPageID([a-zA-Z0-9]+)">
          {isAuthenticated ? (
            <AuthenticatedComparePage />
          ) : (
            <UnauthenticatedComparePage />
          )}
        </Route>
        <Route path="*" component={FourZeroFour} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

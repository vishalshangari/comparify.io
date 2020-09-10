import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import Test from "../../Test";
import Home from "../../components/Home";
import Splash from "../../components/Splash";
import Login from "../../components/Login";
import { useAuthState } from "../../App";
import TestPrivateRoute from "../TestPrivateRoute";
import { RESPONSE_CODES } from "../../constants";
import AuthenticatedCreateComparePage from "../AuthenticatedCreateComparePage";
import AuthenticatedComparePage from "../compare/AuthenticatedComparePage";
import UnauthenticatedComparePage from "../compare/UnauthenticatedComparePage";
import DiscoverTogether from "../compare/DiscoverTogether";
import FormTest from "../FormTest";
import FourZeroFour from "../FourZeroFour";
import CompareRouter from "../CompareRouter";
import UnauthenticatedCreateComparePage from "../UnauthenticatedCreateComparePage";
import Feedback from "../Feedback";
import PrivacyPolicy from "../PrivacyPolicy";

export interface PrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

// Old Private Route - TODO: delete
// const PrivateRoute = ({
//   component: Component,
//   isAuthenticated,
//   ...rest
// }: PrivateRouteProps) => {
//   if (!Component) {
//     throw new Error("Private route component was not specified!");
//   }
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//             }}
//           />
//         )
//       }
//     />
//   );
// };

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
        {/* <Route path="/login" exact component={Login} /> */}
        <Route path="/compare" exact>
          {/* <Route path="/compareTest" exact component={CompareRouter} /> */}
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
        {/* <Route path="/auth" component={Test} />
        <Route path="/formTest" exact component={FormTest} />
        <Route path="/test" component={DiscoverTogether} /> */}
        {/* <Route path="/private" exact>
          {isAuthenticated ? <TestPrivateRoute /> : <Redirect to="/login" />}
        </Route> */}
        {/* OLD Private route
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/private"
          exact
          component={TestPrivateRoute}
        /> */}
        <Route path="*" component={FourZeroFour} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

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
import CreateComparePage from "../CreateComparePage";
import AuthenticatedComparePage from "../compare/AuthenticatedComparePage";
import UnauthenticatedComparePage from "../compare/UnauthenticatedComparePage";
import DiscoverTogether from "../compare/DiscoverTogether";

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
        {/* <Route path="/create" exact component={Create} /> */}
        <Route path="/splash" exact component={Splash} />
        <Route path="/home" exact component={Home} />=
        <Route path="/login" exact component={Login} />
        <Route path="/create" exact component={CreateComparePage} />
        <Route path="/auth" component={Test} />
        <Route path="/test" component={DiscoverTogether} />
        <Route path="/private" exact>
          {isAuthenticated ? <TestPrivateRoute /> : <Redirect to="/login" />}
        </Route>
        <Route path="/:comparifyPageID">
          {isAuthenticated ? (
            <AuthenticatedComparePage />
          ) : (
            <UnauthenticatedComparePage />
          )}
        </Route>
        {/* OLD Private route
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/private"
          exact
          component={TestPrivateRoute}
        /> */}
        <Route path="*" component={Test} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

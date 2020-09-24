import React, { useState } from "react";
import { useAsync } from "react-use";
import Router from "./components/Router";
import { theme } from "./theme";
import GlobalStyle from "./components/GlobalStyle";
import styled, { ThemeProvider } from "styled-components";
import Loader from "./components/Loader";
import { firebaseApp } from "./db";
import { ERROR_CODES, RESPONSE_CODES } from "./constants";

import useWindowSize, { WindowSize } from "./hooks/useWindowSize";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

firebaseApp.analytics();

type AuthStateType = {
  status: "loading" | typeof RESPONSE_CODES;
  errorType: typeof ERROR_CODES | null;
};

type AuthContextType = {
  state: AuthStateType;
  setState: React.Dispatch<React.SetStateAction<AuthStateType>>;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

export function useAuthState() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthStateType>({
    status: "loading",
    errorType: null,
  });

  useAsync(async () => {
    try {
      const response = await fetch(`${DEV_URL}/api/auth/verifyToken`, {
        credentials: "include",
      });
      const responseBody = await response.json();
      setState({
        status: responseBody.status,
        errorType: responseBody.errorType,
      });
    } catch (error) {
      // TODO: generic error handler -> redirect to error page with query string
    }
  }, [DEV_URL]);

  return (
    <AuthContext.Provider value={{ state: state, setState: setState }}>
      {state.status === "loading" ? <Loader label fullscreen /> : children}
    </AuthContext.Provider>
  );
};

const App = () => {
  const size = useWindowSize();
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* <FullPageTest size={size}></FullPageTest> */}
        <AuthProvider>
          <FullSiteWrap style={{ minHeight: size?.height }}>
            <Router />
          </FullSiteWrap>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

const FullPageTest = styled.div<{ size: WindowSize }>`
  height: ${({ size }) => (size ? size.height + `px` : ``)};
  background: tomato;
`;

const FullSiteWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  overflow: hidden;
`;

export default App;

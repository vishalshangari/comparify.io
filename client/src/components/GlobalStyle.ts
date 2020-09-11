import { createGlobalStyle } from "styled-components";
import { Theme } from "../theme";

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  /* Reset */
  *,
  *::before,
  *::after{box-sizing:border-box;}
  a{text-decoration:none; color:inherit; cursor:pointer;}
  button{font-family: 'open sans', sans-serif;background-color:transparent; color:inherit; border-width:0; padding:0; cursor:pointer; font-size: 1rem;}
  figure{margin:0;}
  input::-moz-focus-inner {border:0; padding:0; margin:0;}
  ul, ol, dd{margin:0; padding:0; list-style:none;}
  h1, h2, h3, h4, h5, h6{margin:0; font-size:inherit; font-weight:inherit; line-height: 1}
  p{margin:0;}
  cite {font-style:normal;}
  fieldset{border-width:0; padding:0; margin:0;}
  html {
    height: 100%;
  }

  body {
    height: 100%;
    background: black;
    // background: ${({ theme }) => theme.colors.bodyBg};
    font-family: ${({ theme }) => theme.fonts.main}, sans-serif;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
  }

  * {
    transition: 0.2s ease font-size;
  }

  h1, h2 {
    font-family: ${({ theme }) => theme.fonts.brand}, serif;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  h3 {
    font-family: 'open sans', sans-serif;
  }


  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;

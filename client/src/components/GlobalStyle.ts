import { createGlobalStyle } from "styled-components";
import { Theme } from "../theme";

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  /* Reset */
  *,
  *::before,
  *::after{box-sizing:border-box;}
  a{text-decoration:none; color:inherit; cursor:pointer;}
  button{background-color:transparent; color:inherit; border-width:0; padding:0; cursor:pointer;}
  figure{margin:0;}
  input::-moz-focus-inner {border:0; padding:0; margin:0;}
  ul, ol, dd{margin:0; padding:0; list-style:none;}
  h1, h2, h3, h4, h5, h6{margin:0; font-size:inherit; font-weight:inherit; line-height: 1}
  p{margin:0;}
  cite {font-style:normal;}
  fieldset{border-width:0; padding:0; margin:0;}

  body {
    background: ${({ theme }) => theme.colors.navigationBg};
  }

  * {
    transition: 0.2s ease font-size;
  }

  h1 {
    font-family: 'Roboto Slab', serif;
  }

  h2 {
    font-family: 'Roboto Slab', serif;
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

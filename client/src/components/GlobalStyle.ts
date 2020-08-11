import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background: black;
  }

  * {
    transition: 0.2s ease font-size;
  }

  h1 {
    font-family: 'Roboto Slab', serif;
  }

  h2 {
    font-family: 'open sans', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;

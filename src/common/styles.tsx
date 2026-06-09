import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 1rem;
}

::-webkit-scrollbar {
  display: none;
  width: 0;
}

body {
  background-color: #e5ebed;
  font-family: "Ubuntu", sans-serif;
  font-size: 1rem;
}

h1,
h2,
h3 {
  font-weight: 500;
}

#root {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}
`;

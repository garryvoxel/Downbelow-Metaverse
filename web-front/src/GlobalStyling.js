import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
* {
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:${props => props.theme.fonts.body};
  font-weight: 400;
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing:antialiased;
  background-color:black;
  overflow-x:hidden;
  scroll-behavior: smooth;
}
`;
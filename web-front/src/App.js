import React, { useState } from "react";
import Router from "./Router";

import { ThemeProvider } from 'styled-components';
import DarkTheme from './Themes/DarkTheme';

import CreateGlobalStyle from './GlobalStyling';

function App() {
  return (
    <ThemeProvider theme={DarkTheme}>
      <CreateGlobalStyle/>
      <Router/>
    </ThemeProvider>
  );
}

export default App;
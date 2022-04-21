import React from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import {Home} from './Components/Pages/Home/Home';
import { UserPage } from './Components/Pages/UserPage';
import { StorePage } from './Components/Pages/Store';
import { InvetoryPage } from './Components/Pages/Inventory';
import { WhitelistResult } from './Components/Pages/WhitelistResult';
import { NavBar } from './Components/Modules/Navbar';
import { TokenPage } from './Components/Pages/TokenPage';

const Router = () => {
    return (
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/Login" element={<UserPage/>} />
          <Route exact path="/Game" element={<StorePage/>} />
          <Route exact path="/Inventory" element={<InvetoryPage/>}/>
          <Route exact path="/Whitelist" element={<WhitelistResult/>}/>
          <Route exact path="/Token" element={<TokenPage/>}/>
        </Routes>
      </BrowserRouter>
    )
}
  
export default Router;
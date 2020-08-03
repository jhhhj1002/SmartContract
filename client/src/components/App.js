import React, { Suspense, Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import Web3 from 'web3';
import './App.css';
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
import DetailProductPage from './views/DetailProductPage/DetailProductPage';
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';
import Mypage from './views/MyPage/Mypage';
import Edit from './views/Edit/Edit';

class App extends Component{
  componentDidMount = async () => {
    await this.initWeb3();
  }
  initWeb3 = async () => {
    if (window.ethereum) {
      console.log('recent mode');
      this.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          //this.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
          console.log('user denied account access error: ' + error);
      }
  }
   // Legacy dapp browsers...
    else if (window.web3) {
     console.log('legacy mode');
       this.web3 = new Web3(window.web3.currentProvider);
       // Acccounts always exposed
        //web3.eth.sendTransaction({/* ... */});
   }
    // Non-dapp browsers...
    else {
     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
   }
   
 }
 render(){ return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          <Route exact path="/mypage" component={Auth(Mypage, true)} />
          <Route exact path="/edit" component={Auth(Edit, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}
}

export default App;

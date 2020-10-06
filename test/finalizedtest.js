import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {
    getCartItems,
    removeCartItem,
    onSuccessBuy
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty } from 'antd';
import web3 from 'web3';
import Config from '../../Config';

const [MyAuctionValues, setMyAuctionValues] = useState({ contractInstance: '', productId: '', from: '', to: '', productPrice: '', tokenid:''})
//const Auction = artifacts.require("Auction");

const finalizeAuction = () =>{
    Web3.eth.getAccounts(function(error, accounts) {
           if(error) {
                console.log('error');
            }
        var account = accounts[0]
        console.log(account)
        var too= props.user.cartDetail[0].writer.wallet
        
        console.log("to", too)
        get_auc_id()
        var price = 3
        let receipt = await MyAuctionValues.contractInstance.finalizeAuction( auc_id[0], too, {from: account, gas: Config.GAS_AMOUNT, value:Web3.utils.toWei(String(price), 'ether')})
       console.log(receipt);
        MyAuctionValues.contractInstance.finalizeAuction( auc_id[0], too, {from: account, gas: Config.GAS_AMOUNT, value:Web3.utils.toWei(String(price), 'ether')}, (error, result) => {
             console.log(result)
         })
        
        
        //var price = 4;
        // MyAuctionValues.contractInstance.finalizeAuction( auc_id[0], too, {from: account, gas: Config.GAS_AMOUNT, value:Web3.utils.toWei(String(price), 'ether')}, (error, result) => {
        //     console.log(result)
        // })

    })
}
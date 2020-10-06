import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {
    getCartItems,
    removeCartItem,
    onSuccessBuy
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty } from 'antd';
import Config from '../../Config';

import Web3 from 'web3';
import Axios from 'axios';


//import Paypal from '../../utils/Paypal';



function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)
    // var Web3 = new web3(web3.givenProvider || 'ws://some.local-or-remote.node:8546')
    const web3 = new Web3(window.web3.currentProvider);
    //https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html 여기서 web3함수랑 초기설정있음!
    const [MyAuctionValues, setMyAuctionValues] = useState({ contractInstance: '', productId: '', from: '', to: '', productPrice: '', tokenid:'', meta_addr:''})
    let auc_id=[];
    let prod_id=[];

    const [MyAccount, setMyAccount]  =  useState("")

    const setAddress = () =>{
        web3.eth.getAccounts(function(error, accounts) {
            if(error) {
                 console.log('error');
             }
             setMyAccount(accounts[0])
     })
    }
   
    useEffect(() => {
        setAddress()
    }, []);



    useEffect(() => {
        setMyAuctionValues({contractInstance: window.web3.eth.contract(Config.AUCTIONS_ABI).at(Config.AUCTIONS_CA), meta_addr : MyAccount});

      let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then((response) => {
                        if (response.payload.length > 0) {
                            calculateTotal(response.payload)
                        }
                    })
            }
        }

    }, [props.user.userData,MyAccount])
/////////// 옥션 아이디 가져오는 함수
    const get_auc_id = () =>{
        for(let i =0;i<props.user.userData.cart.length;i++){
            console.log("lengthd",props.user.userData.cart.length)
            for(let j=0;j<props.user.cartDetail[i].writer.upload.length;j++){
                if( props.user.cartDetail[i]._id == props.user.cartDetail[i].writer.upload[j].id ){
                    console.log("id vs id", props.user.cartDetail[i]._id, props.user.cartDetail[i].writer.upload[j].id)
                    console.log("auc_id index in user upload",j)
                    auc_id.push(j)
                }
            }
            console.log("arr", auc_id)
        }
    }
    const get_prod_id=()=>{
        for(let i =0;i<props.user.userData.cart.length;i++){
            console.log("len ", props.user.userData.cart.length )
            prod_id.push(props.user.cartDetail[i]._id)
        }
    }

    const calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {//정수말고 실수로 바꿔야함
            total += parseFloat(item.price, 10) * item.quantity
        });

        setTotal(total)
        setShowTotal(true)
    }


    const removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then((response) => {
                if (response.payload.cartDetail.length <= 0) {
                    setShowTotal(false)
                } else {
                    calculateTotal(response.payload.cartDetail)
                }
            })
    }

    const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({
            cartDetail: props.user.cartDetail,
            paymentData: data
        }))
            .then(response => {
                if (response.payload.success) {
                    setShowSuccess(true)
                    setShowTotal(false)
                }
            })
    }

    const transactionError = () => {
        console.log('Paypal error')
    }

    const transactionCanceled = () => {
        console.log('Transaction canceled')
    }
////////////////////////////////////////////////
    //let auctionId = MyAuctionValues.contractInstance.auctionOwner[window.ethereum._state.accounts[0]]

    const getbalance=()=>{
        MyAuctionValues.contractInstance.getBalance({}, (err, result)=>{
            console.log("balance", result)
        })
    }
    const getaddr=()=>{
        MyAuctionValues.contractInstance.getaddr({}, (err, result)=>{
            console.log("addr",result)
        })
    }
    const getAuctionsOf =()=>{
        MyAuctionValues.contractInstance.getAuctionsOf(MyAuctionValues.meta_addr, (error, result) => {
            console.log("auctionids = ", result)
        })
    }

    const getAuctionById=()=>{
        get_auc_id()
        MyAuctionValues.contractInstance.getAuctionById(auc_id[0], (error, result)=>{
            console.log("getauctionbyid", result)
        })
    }

    const getCount = () =>{
        MyAuctionValues.contractInstance.getCount({}, (error, result) =>{
            console.log("getcount", result)
        })
    }
    const getAuctionsCountOfOwner = ()=>{
        MyAuctionValues.contractInstance.getAuctionsCountOfOwner(MyAuctionValues.meta_addr, (error, result)=>{
            console.log("getAuctionsCountOfOwner",result)
        })
    }
    
    const editActive = () => {
        get_prod_id()
        const variables = {
            id: prod_id[0],
            bol : false
        }
        console.log(prod_id[0])
        Axios.post('/api/product/editActive', variables)
        .then(response => {
            if (response.data.success) {
                alert('Activate Successfully Edited')
    
            } else {
                alert('Failed to Edit Activate')
            }
        })
    }
    const test = () =>{
        editActive()
    }

    var price = Total
    console.log(web3.eth)
 
  
    const finalizeAuction = (data) =>{
        console.log(MyAuctionValues.meta_addr)
        console.log(props.user.cartDetail[0].writer.wallet)
            const too= props.user.cartDetail[0].writer.wallet
            console.log("w3", web3)
            console.log("to", too)
            console.log("price",Total)
            get_auc_id()

            const sendarr = String(MyAuctionValues.meta_addr)
            console.log("확인" + sendarr)
            const recarr = String(props.user.cartDetail[0].writer.wallet)
            
            web3.eth.sendTransaction({
                from: sendarr,
                to: recarr, 
                value: web3._extend.utils.toWei(String(Total), 'ether'), 
            }, function(err, transactionHash) {
                if (err) { 
                    console.log(err); 
                } else {

                    console.log(transactionHash);
                    MyAuctionValues.contractInstance.finalizeAuction( auc_id[0], too, {from: MyAuctionValues.meta_addr, gas: Config.GAS_AMOUNT}, (error, result) => {
                        console.log(result)
        
                    })
                    
                     transactionSuccess(data)
                }
            });
      
    }

    //   var price = Total
      const sayHello = function(){ 

        console.log("가격", Total)


      };


// >>>>>>> 30c425c5a9f2664f20d12afd488ad10f44c585a6

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            <div>

                <UserCardBlock
                    products={props.user.cartDetail}
                    removeItem={removeFromCart}
                />


                {ShowTotal ?
                    <div style={{ marginTop: '3rem' }}>
                        <h2>Total amount: ${Total} </h2>
                    </div>
                    :
                    ShowSuccess ?
                        <Result
                            status="success"
                            title="Successfully Purchased Items"
                        /> :
                        <div style={{
                            width: '100%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <br />
                            <Empty description={false} />
                            <p>No Items In the Cart</p>

                        </div>
                }
            </div>




            {/*ShowTotal &&	                <button class="btn btn-info btn-buy"

                    type="button"
                <Paypal	                    data-toggle="modal"
                    toPay={Total}	                    data-target="#buyModal">
                    onSuccess={transactionSuccess}	                    구매
                    transactionError={transactionError}	                </button>
                    transactionCanceled={transactionCanceled}	                <div class="modal fade" tabindex="-1" role="dialog" id="buyModal">
                />	                    <div class="modal-content">

                    <div class="modal-footer">
            */}

            {/* Paypal Button    @@@@@@@@@@@@@@@@@@@@@@@@@@@채연 변경할 버튼 구간@@@@@@@@@@@@@@@@@@*/}



                <button class="btn btn-info btn-buy"
                    type="button"
                    data-toggle="modal"
                    data-target="#buyModal">
                    구매
                </button>

                <button type="button" onClick={getAuctionsCountOfOwner}>getAuctionsCountOfOwner</button>
                <button type="button" onClick={getCount}>getCount</button>
                <button type="button" onClick={getAuctionById}>getAuctionById</button>
                

                
                <button type="button" onClick={sayHello}>채연1</button>
                <button type="button" onClick={test}>edittest</button>
                <button type="button" onClick={getAuctionById}>현경</button>

                <div class="modal fade" tabindex="-1" role="dialog" id="buyModal">
                    <div class="modal-content">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onClick={finalizeAuction}>finalizeAuction</button>
                    </div>
                    </div>
                </div>
            



        </div>
    )
}

export default CartPage

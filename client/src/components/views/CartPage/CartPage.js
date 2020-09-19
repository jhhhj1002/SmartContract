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


//import Paypal from '../../utils/Paypal';

function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)
    var Web3 = new web3(web3.givenProvider || 'ws://some.local-or-remote.node:8546')
    //https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html 여기서 web3함수랑 초기설정있음!
    const [MyAuctionValues, setMyAuctionValues] = useState({ contractInstance: '', productId: '', from: '', to: '', productPrice: '', tokenid:''})

   


    useEffect(() => {
        setMyAuctionValues({contractInstance: window.web3.eth.contract(Config.AUCTIONS_ABI).at(Config.AUCTIONS_CA)});

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

    }, [props.user.userData])

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
    var auctionId
    const getAuctionsOf =()=>{
        Web3.eth.getAccounts(function(error, accounts) {
            var account = accounts[0]

        MyAuctionValues.contractInstance.getAuctionsOf(account, {from:account, gas: Config.GAS_AMOUNT}, (error, result) => {
            auctionId = result
        })
        console.log("auctionid = ", auctionId)
    })
    }
    const finalizeAuction = () =>{
        Web3.eth.getAccounts(function(error, accounts) {
               if(error) {
                    console.log('error');
                }
            var account = accounts[0]
            console.log(account)
            var too= props.user.cartDetail[0].writer.wallet
            MyAuctionValues.contractInstance.finalizeAuction( 3, too, {from: account, gas: Config.GAS_AMOUNT}, (error, result) => {
                console.log(result)
            
            })
        })
    }
////////////////////////////////////////////

const testFinalizeAuction = () =>{
    Web3.eth.getAccounts(function(error, accounts) {
           if(error) {
                console.log('error');
            }
        var account = accounts[0]
        console.log(account)
        var too= props.user.cartDetail[0].writer.wallet
        MyAuctionValues.contractInstance.testFinalizeAuction( too, {from: account, gas: Config.GAS_AMOUNT},  3,(error, result) => {
            console.log(result)
        
        })
    })
}




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

                <button type="button" onClick={testFinalizeAuction} value={Total}>채연</button>


                <div class="modal fade" tabindex="-1" role="dialog" id="buyModal">
                    <div class="modal-content">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onClick={finalizeAuction}>구매테스트</button>
                    </div>
                    </div>
                </div>
            



        </div>
    )
}

export default CartPage

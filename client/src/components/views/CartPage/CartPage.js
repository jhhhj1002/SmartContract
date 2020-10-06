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
    const [MyAuctionValues, setMyAuctionValues] = useState({ contractInstance: '', productId: '', from: '', to: '', productPrice: '', tokenid:'', meta_addr:''})
    let auc_id=[];


    const [MyAccount, setMyAccount]  =  useState("")

    const setAddress = () =>{
        Web3.eth.getAccounts(function(error, accounts) {
            if(error) {
                 console.log('error');
             }
             setMyAccount(accounts[0])
     })
    }
   


    useEffect(() => {
        setAddress()
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

    }, [props.user.userData])
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

    var price = Total
    const finalizeAuction = (data) =>{
            var too= props.user.cartDetail[0].writer.wallet
            console.log("to", too)
            console.log("price",Total)
            get_auc_id()

            MyAuctionValues.contractInstance.finalizeAuction( auc_id[0], too, {from: MyAuctionValues.meta_addr, gas: Config.GAS_AMOUNT, value:Web3.utils.toWei(String(Total), 'ether')}, (error, result) => {
                 console.log(result)
             })
            
             transactionSuccess(data)
      
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

                <button type="button" onClick={buyAuction}>채연</button>
                <button type="button" onClick={getAuctionsCountOfOwner}>getAuctionsCountOfOwner</button>
                <button type="button" onClick={getCount}>getCount</button>
                <button type="button" onClick={getAuctionById}>getAuctionById</button>
                

                
                <button type="button" onClick={sayHello}>채연1</button>
                <button type="button" onClick={finalizeAuction}>finalizeAuction</button>
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

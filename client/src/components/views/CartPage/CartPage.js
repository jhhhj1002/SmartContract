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
//import Paypal from '../../utils/Paypal';

function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {

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

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
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

    const buyRealEstate = () => {
        // var id = $('#id').val();
        // var name = $('#name').val();
        // var price = $('#price').val();
        // var age = $('#age').val();
    
        // console.log(id);
        // console.log(price);
        // console.log(name);
        // console.log(age);
    
        web3.eth.getAccounts(function(error, accounts) {
          if(error) {
            console.log('error');
          }
          var account = accounts[0];
          this.RealEstate.deployed().then(function(instance) {
            // utf8 미리 파일 첨부해둠

            //var nameUtf8Encoded = utf8.encode(name);


            // byte type을 hex로 변경
            // payable함수이기 때문에 ether도 전송해야 한다. 
            // 어느 계정에서 이 함수를 가져온지도 명시 해야 한다. from : account
            // 계정정보 호출은 web3로 해야한다. 
            return instance.buyRealEstate(0, web3, 0, { from: account, value: 0 }); 
          }).then(function(){
            // input clear 확인
            // $('#name').val('');
            // $('#age').val('');
            // $('#buyModal').modal('hide');
            //return App.loadRealEstates(); 
          }).catch(function(err) {
            console.log(err.message);
          });
        });
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




            {/* Paypal Button    @@@@@@@@@@@@@@@@@@@@@@@@@@@채연 변경할 버튼 구간@@@@@@@@@@@@@@@@@@*/}

                <button class="btn btn-info btn-buy"
                    type="button"
                    data-toggle="modal"
                    data-target="#buyModal">
                    구매
                </button>
                <div class="modal fade" tabindex="-1" role="dialog" id="buyModal">
                    <div class="modal-content">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick={buyRealEstate}>제출</button>
                    </div>
                    </div>
                </div>
            



        </div>
    )
}

export default CartPage

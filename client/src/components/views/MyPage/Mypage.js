import React from 'react'

// 내가 업로드한 내역 ==> 정렬 추가 
// + 내가 구매한 내역 -> History 연결 
// userCartInfo 참고

function Mypage(props) {

    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Mypage</h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                    </tr>
                </thead>

                <tbody>


                </tbody>
            </table>
        </div>
    )
}

export default Mypage

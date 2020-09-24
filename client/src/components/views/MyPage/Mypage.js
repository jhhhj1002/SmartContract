import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { Icon, Col, Card, Row, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import { sort } from './RadioBoxForSorting';
import RadioBox from './RadioBoxForSorting';
import {
    deleteItem
} from '../../../_actions/user_actions';
// import RadioBox from '../LandingPage/Sections/RadioBox';

// 내가 업로드한 내역 ==> Done
// Product 정렬 + Filters, continents, Skip, Limit 필요없는 것들 수정 ==> Done
// Product 수정 버튼 추가 - ant-design/icons 활용 -> css 조금 수정함 (지현) ==> Done
// Product 삭제 버튼 추가 - ant-design/icons 활용 -> css 조금 수정함 (지현) ==> Done
// 회원정보 수정 버튼 추가 ==> Done
//  Product 삭제 동작 구현 - deleteHandler에서 productId는 제대로 받아오지만 deleteItem메소드로가면 전달이 안되는것 같음 ==> Done
// Product 수정 페이지 만들기
// User 수정 페이지 만들기
// + 내가 구매한 내역 -> History 연결 ? -> 이건위에 바로 history잇으니까 없어도 될듯해


// --> NEW!!!
// 내가 업로드한 내역중 active 한것, active 하지 않은것 구분 
// delete 삭제


const { Meta } = Card;

function Mypage(props) {
    const dispatch = useDispatch();
    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()

    const [Filters, setFilters] = useState({
        continents: [],
        sort: []
    })

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getProducts(variables)

    }, [])

    const getProducts = (variables) => {
        Axios.post('/api/users/userUploadInfo', variables)
            .then(response => {
                if (response.data.success) {
                    if (variables.loadMore) {
                        setProducts([...Products, ...response.data.products])
                    } else {
                        setProducts(response.data.products)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fectch product datas')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters,
        }
        getProducts(variables)
        setSkip(skip)
    }

    /* 상품 삭제 메소드 */
    const deleteHandler = (event, productId) => {
        alert("Are you sure you want to delete it ?")
        event.preventDefault();
        console.log("productid", productId)
        dispatch(deleteItem(productId))
            .then(response => response.data)

        window.location.reload()
    }


    const renderCards = Products.map((product, index) => {


        return <Col lg={6} md={8} xs={24}>
            {product.active == true ?
                <Card
                    hoverable={true}
                    cover={<a href={`/product/${product._id}`} style={{ marginTop: '1rem' }} > <ImageSlider images={product.images} /></a>}
                >
                    <Meta
                        title={product.title}
                        description={`$${product.price}`}
                    /><br />

                    <Button style={{ float: 'left', marginRight: '1rem' }}>
                        <EditOutlined />
                        <a href={`/edit/${product._id}`}>edit</a>
                    </Button>
                </Card>
                :
                <Card
                    style={{ backgroundColor: "lightgray" , webkitFilter: "grayscale(100%)"}}
                    hoverable={true}
                    cover={<a href={`/product/${product._id}`} style={{marginTop: '1rem' }} > <ImageSlider images={product.images} /></a>}
                >

                    <Meta
                        title={product.title}
                        description={`$${product.price}`}
                    /><br />

                    <Button style={{ backgroundColor: "lightgray", float: 'left', marginRight: '1rem' }}>
                        <EditOutlined />
                        <a href={`/edit/${product._id}`}>edit</a>
                    </Button>
                    {/* <form>
                        <Button type="submit" onClick={(event) => deleteHandler(event, product._id)} style={{ backgroundColor: "lightgray",float: 'left' }}>
                            <DeleteOutlined />
                    delete
                </Button>
                    </form> */}
                </Card>
            }

        </Col>


        // if(product.active == true){
        //     return <Col lg={6} md={8} xs={24}>

        //     <Card
        //         hoverable={true}
        //         cover={<a href={`/product/${product._id}`} style={{  marginTop: '1rem' }} > <ImageSlider images={product.images} /></a>}
        //     >
        //         <Meta
        //             // title={`${product.active}`}
        //             title={product.title}
        //             description={`$${product.price}`}
        //         /><br/>

        //         <Button style={{ float: 'left',marginRight : '1rem'}}>
        //             <EditOutlined />
        //             <a href={`/edit/${product._id}`}>edit</a>
        //         </Button>
        //         <form>
        //         <Button type="submit" onClick={(event) => deleteHandler(event, product._id)} style={{ float: 'left'}}>
        //             <DeleteOutlined />
        //             delete
        //         </Button>
        //         </form>
        //     </Card>
        // </Col>
        // }
        // else{
        //     return <Col lg={6} md={8} xs={24} style={{ backgroundColor: "red"}} >
        //     <div style={{ backgroundColor: "orange"}}>

        //     <Card
        //     style={{ backgroundColor: "purple"}}
        //         hoverable={true}
        //         cover={<a href={`/product/${product._id}`} style={{ backgroundColor: "blue", marginTop: '1rem'}} > <ImageSlider images={product.images} style={{ Color: "green"}}/></a>}
        //     >
        //         <Meta
        //          style={{ backgroundColor: "yellow"}}
        //             // title={`${product.active}`}
        //             title={product.title}
        //             description={`$${product.price}`}
        //         /><br/>

        //         <Button style={{ backgroundColor: "pink", float: 'left',marginRight : '1rem'}}>
        //             <EditOutlined />
        //             <a href={`/edit/${product._id}`}>edit</a>
        //         </Button>
        //         {/* <form>
        //         <Button type="submit" onClick={(event) => deleteHandler(event, product._id)} style={{ float: 'left'}}>
        //             <DeleteOutlined />
        //             delete
        //         </Button>
        //         </form> */}
        //     </Card>
        //     </div>
        // </Col>



    })

    const showFilteredResults = (filters) => {
        console.log(filters)
        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(variables)
        setSkip(0)

    }

    const handleFilters = (filters, category) => {
        console.log(filters)

        const newFilters = { ...Filters }

        newFilters[category] = filters

        if (category === "sort") {
            newFilters[category] = filters

        }

        console.log(newFilters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>  My Product  <Icon type="gift" />  </h2>
            </div><br />
            <div>
                <a href={`myaccount`} >
                    <Button style={{ float: 'right' }}>
                        <EditOutlined />
                            My Account
                    </Button>
                </a>
            </div><br /><br />

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    <RadioBox
                        list={sort}
                        handleFilters={filters => handleFilters(filters, "sort")}
                    />
                </Col>
            </Row><br />



            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>

                        {renderCards}

                    </Row>


                </div>
            }
            <br /><br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }


        </div>
    )
}

export default Mypage
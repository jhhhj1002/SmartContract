import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import {sort} from './RadioBoxForSorting';
import RadioBox from './RadioBoxForSorting';
// import RadioBox from '../LandingPage/Sections/RadioBox';

// 내가 업로드한 내역 ==> Done
// Product 정렬 + Filters, continents, Skip, Limit 필요없는 것들 수정 
// Product 수정 버튼 추가
// Product 수정 페이지 만들기
// + 내가 구매한 내역 -> History 연결 ?


const { Meta } = Card;

function Mypage(props) {

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
        Axios.get('/api/users/userUploadInfo', variables)
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

    const renderCards = Products.map((product, index) => {

        return <Col lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                cover={<a href={`/product/${product._id}`} > <ImageSlider images={product.images} /></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters

        }
        getProducts(variables)
        setSkip(0)

    }

    const handlePrice = (value) => {
        const data = sort;
        let array = [];

        for (let key in data) {

            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        console.log('array', array)
        return array
    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        if (category === "sort") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues

        }

        console.log(newFilters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
        <div style={{ textAlign: 'center' }}>
            <h2>  My Product  <Icon type="gift" />  </h2>
        </div><br/>

        <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    <RadioBox
                        list={sort}
                        handleFilters={filters => handleFilters(filters, "sort")}
                    />
                </Col>
        </Row><br/>



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

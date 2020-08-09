import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';
import { set } from 'mongoose';

const { Title } = Typography;
const { TextArea } = Input;

const Continents = [
    { key: 1, value: "Music" },
    { key: 2, value: "Image" },
    { key: 3, value: "PPT Templates" },
    { key: 4, value: "Literature" },
    { key: 5, value: "SW" },
    { key: 6, value: "Etc" }
]

function EditProduct(props) {

    //상품id갖고오기
    const productId = props.match.params.productId

    const [Product, setProduct] = useState([])
    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [ContinentValue, setContinentValue] = useState(0)

    const [Images, setImages] = useState([])

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
                setTitleValue(response.data[0].title)
                setDescriptionValue(response.data[0].description)
                setPriceValue(response.data[0].price)
                setContinentValue(response.data[0].continents)
                setImages(...Images, response.data[0].images)
            })

    }, [])
    console.log("editproduct의 상품 usestate =",Product)

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const onPriceChange = (event) => {
        setPriceValue(event.currentTarget.value)
    }

    const onContinentsSelectChange = (event) => {
        setContinentValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const onSubmit = (event) => {
        event.preventDefault();


        if (!TitleValue || !DescriptionValue || !PriceValue ||
            !ContinentValue || !Images) {
            return alert('fill all the fields first!')
        }

        const variables = {
            id: productId,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            continents: ContinentValue,
        }
        console.log("submit 안에 들어옴 p.id=", productId)


        Axios.post('/api/product/editProduct', variables)
            .then(response => {
                console.log("axios 안에 들어옴")
                if (response.data.success) {
                    alert('Product Successfully Edited')

                } else {
                    alert('Failed to Edit Product')
                }
            })
        window.location.href=`http://localhost:3000/mypage`
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> Edit Your Product</Title>
            </div>

            
            <Form onSubmit={onSubmit} >

                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} style={{ textAlign: 'center' }} />

                <br />
                <br />
                <label>Category</label><br />
                <select onChange={onContinentsSelectChange} value={ContinentValue}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value} </option>
                    ))}
                </select>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                />
                <br />
                <br />
                <label>Price($)</label>
                <Input
                    onChange={onPriceChange}
                    value={PriceValue}
                    type="number"
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={DescriptionValue}
                />
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default EditProduct

import React, { useEffect, useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

import Config from '../../Config';


import Web3 from 'web3';
// 2. 토큰 중복시 에러처리 방법 생각하기



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



function UploadProductPage(props) {

    const [MyNFTValues, setMyNFTValues] = useState({ account: '', contractInstance: '', tokenId: '', isRegistered: false })
    const [MyAuctionValues, setMyAuctionValues] = useState({ auctionTitle: '', contractInstance: '', price: '' })

    // const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/')); // 가나슈 서버 포트
    // var myaccount = window.web3.eth.accounts[0];

    const web3 = new Web3(window.web3.currentProvider);
    const [MyAccount, setMyAccount] = useState("")

    const setAddress = () => {
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log('error');
            }
            setMyAccount(accounts[0])
        })
    }


    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    useEffect(() => {
        setAddress()
    }, []);

    useEffect(() => {
        // var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/')); // 가나슈 서버 포트
        setMyNFTValues({ account: MyAccount, contractInstance: window.web3.eth.contract(Config.MYNFT_ABI).at(Config.MYNFT_CA), tokenId: getRandomInt(123456789, 999999999) });
        setMyAuctionValues({ contractInstance: window.web3.eth.contract(Config.AUCTIONS_ABI).at(Config.AUCTIONS_CA) });
    }, [MyAccount]);

    console.log(MyNFTValues)

    const uploadProduct = (variables) => {
        Axios.post('/api/product/uploadProduct', variables)
            .then(response => {
                if (response.data.success) {
                    Axios.post('/api/users/updateUserUploadInfo', { "productId": response.data.productId }) //내가추가
                        .then(response => {
                            if (response.data.success) {
                                alert('Product Successfully Uploaded')
                                props.history.push('/')
                            } else {
                                alert('Failed to upload Product')
                            }
                        })
                } else {
                    alert('Failed to upload Product')
                }
            })
    }



    const getCurrentBlock = () => {
        return new Promise((resolve, reject) => {
            window.web3.eth.getBlockNumber((err, blocknumber) => {
                if (!err) resolve(blocknumber)
                reject(err)
            })
        })
    }

    const watchTokenRegistered = (variables) => {
        const currentBlock = getCurrentBlock()
        const eventWatcher = MyNFTValues.contractInstance.TokenRegistered({}, { fromBlock: currentBlock - 1, toBlock: 'latest' })
        // eventWatcher.watch(cb)

        console.log((JSON.stringify(eventWatcher)))

        if (eventWatcher) {

            alert("Token registered...!")
            MyNFTValues.isRegistered = true
            transferToCA(variables)

        }

        console.log(MyNFTValues)
    }

    const watchCreated = (variables) => {
        const currentBlock = getCurrentBlock()
        const eventWatcher = MyAuctionValues.contractInstance.AuctionCreated({}, { fromBlock: currentBlock - 1, toBlock: 'latest' })
        // eventWatcher.watch(cb)

        if (eventWatcher) {
            alert("Creation completed...!")
            uploadProduct(variables)
        }
    }


    const createAuction = (variables) => {
        const price = window.web3.toWei(MyAuctionValues.price, 'ether')
        MyAuctionValues.contractInstance.createAuction(Config.MYNFT_CA, MyNFTValues.tokenId, MyAuctionValues.auctionTitle, price, { from: MyNFTValues.account, gas: Config.GAS_AMOUNT }, (error, transactionHash) => {
            if (error) {
                alert("트랜잭션을 거부하였습니다. 다시 시도해 주십시오.")
            } else {
                console.log("txhash", transactionHash)
                console.log("auc_info", MyNFTValues.tokenId, MyAuctionValues.auctionTitle, price)
                watchCreated(variables)
            }
        })
    }

    const watchTransfered = (variables) => {
        const currentBlock = getCurrentBlock()
        const eventWatcher = MyNFTValues.contractInstance.Transfer({},
            { from: currentBlock - 1, toBlock: 'latest' })
        // eventWatcher.watch(cb)
        if (eventWatcher) {
            alert("token transgered to CA!")
            createAuction(variables)
        }
    }

    const transferToCA = (variables) => {
        MyNFTValues.contractInstance.transferFrom(MyNFTValues.account, Config.AUCTIONS_CA, MyNFTValues.tokenId, {
            from: MyNFTValues.account,
            gas: Config.GAS_AMOUNT
        }, (error, result) => {
            if (error) {
                alert("트랜잭션을 거부하였습니다. 다시 시도해 주십시오.")
            } else {
                console.log("result", result)
                watchTransfered(variables)
            }
        })
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (!TitleValue || !DescriptionValue || !PriceValue || !ContinentValue || !Images) {
            return alert('fill all the fields first!')
        }

        const variables = {
            tokenId: MyNFTValues.tokenId,
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            continents: ContinentValue,
            active: true
        }
        console.log(MyNFTValues)

        MyNFTValues.contractInstance.registerUniqueToken(MyNFTValues.account, MyNFTValues.tokenId, {
            from: MyNFTValues.account,
            gas: Config.GAS_AMOUNT
        }, (error, result) => {
            if (error) {
                alert("트랜잭션을 거부하였습니다. 다시 시도해 주십시오.")
            } else {
                console.log("result", result)
                watchTokenRegistered(variables)
            }
        })
    }

    //------------------------------------------------------------------------




    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [ContinentValue, setContinentValue] = useState(1)

    const [Images, setImages] = useState([])

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

    //------------------------------------------------------------------------

    useEffect(() => {
        setMyAuctionValues({ auctionTitle: TitleValue, contractInstance: window.web3.eth.contract(Config.AUCTIONS_ABI).at(Config.AUCTIONS_CA), price: PriceValue });
    }, [TitleValue, PriceValue]);



    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> Upload Your Product</Title>
            </div>


            <Form onSubmit={onSubmit}>

                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} style={{ textAlign: 'center' }} />

                <br />
                <br />
                <label>TokenId</label>
                <Input
                    value={MyNFTValues.tokenId}
                />
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

export default UploadProductPage

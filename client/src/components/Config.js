//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')

export default {
	MYNFT_CA: '0xd6fcf780B73965D7309E991dedf1507782309660',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0xBA604381aC7d754BBD0d031cd1Aed4117032f45d',

	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,

	GAS_AMOUNT: 500000
}

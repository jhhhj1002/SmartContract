//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')
const RealEstate = require('../contracts/RealEstate.json')

export default {
	MYNFT_CA: '0x7ED477A9825dF577128926e4f1f065D50a1c4696',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0xE304c5C415C26654617A3e9b389871a41b7C686d',

	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	REALESTATE_ABI: RealEstate.abi,
	GAS_AMOUNT: 300000
}

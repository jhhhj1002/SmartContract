//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')
const RealEstate = require('../contracts/RealEstate.json')

export default {
	MYNFT_CA: '0xd257913Bcf6De1066e109045D848D39AD6a1718F',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0x724754506994457612EDaE5D80e7c55648300fe7',
	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	REALESTATE_ABI: RealEstate.abi,
	GAS_AMOUNT: 300000
}

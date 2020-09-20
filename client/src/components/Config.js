//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')
const RealEstate = require('../contracts/RealEstate.json')

export default {
	MYNFT_CA: '0x8207Dc01Aa513973fd58954510A4473bf2C105e7',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0x3C9015168E1bfd6C128750c647d2945c953de9a4',
	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	REALESTATE_ABI: RealEstate.abi,
	GAS_AMOUNT: 300000
}

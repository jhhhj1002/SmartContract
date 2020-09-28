//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')
const RealEstate = require('../contracts/RealEstate.json')

export default {
	MYNFT_CA: '0x942DA9bE26Aa933D3a384E17deD4363b6F1adc87',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0xBFA14b0f2BB3902aC4800F5cA999c5B619737748',

	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	REALESTATE_ABI: RealEstate.abi,
	GAS_AMOUNT: 300000
}

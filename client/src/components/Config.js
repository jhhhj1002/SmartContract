//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')

export default {
	MYNFT_CA: '0x1fa082b9Bad169b4262931D32Ae122c06c164b59',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0xf821cc2A09912810E2f032DEdbC76272963103Ad',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	GAS_AMOUNT: 300000
}

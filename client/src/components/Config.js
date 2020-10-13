//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')

export default {

	MYNFT_CA: '0x895d284A883865E077819c5142ac77Bdf92fc93d',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0xd3b4874520aA3DeA691245610c39187ec4C01161',
	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	GAS_AMOUNT: 300000
}

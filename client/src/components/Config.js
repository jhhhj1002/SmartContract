//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')

export default {
	MYNFT_CA: '0x04ce313ac7EEF4199d9E46801f5043b74c6fB392',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0x2AF143bd3af0F11850bf0c77Ac32924561278EA3',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	GAS_AMOUNT: 300000
}

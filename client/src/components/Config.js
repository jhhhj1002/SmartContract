//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')

export default {

	MYNFT_CA: '0x1E281b852cFCf64A529d335D5b917542eAB2FA5F',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0x3C264eb3187519d93e898907E0aa3D9520d01E2b',
	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	GAS_AMOUNT: 300000
}

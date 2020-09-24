//SERVER ROUTES
export const USER_SERVER = '/api/users';


const MyNFT = require('../contracts/MyNFT')
const Auctions = require('../contracts/Auctions')
const RealEstate = require('../contracts/RealEstate.json')

export default {
	MYNFT_CA: '0xcac44cde7B2f01FcA669f08460F150Be50cDb52A',//migrate할 때 주소 (사람마다 다시 할 때마다 다름)
	AUCTIONS_CA: '0x9c447b38F40912431752d4C3d713192A4F3F65f9',
	REALSTATE_CA: '',
	
	MYNFT_ABI: MyNFT.abi,
	AUCTIONS_ABI: Auctions.abi,
	REALESTATE_ABI: RealEstate.abi,
	GAS_AMOUNT: 300000
}

pragma solidity  >=0.6.0;

import "./MyNFT.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auctions {
	Auction[] public auctions;		//옥션을 저장하는 배열
 	mapping(address => uint[]) public auctionOwner; 	//소유자 어드레스가 가지고 있는 토큰id
    address public my_addr;

	struct Auction {
	  string name; // 제목
	  uint256 price; // 가격
	//   string metadata; // 메타데이터 : ipfs hash
	  uint256 tokenId; // 토큰 아이디
	  address repoAddress; // nft 컨트랙트 어드레스
	  address owner; // 소유자	(옥션 소유자)			
	  bool active; //활성화 여부
	  bool finalized; //판매 종료여부
	}
	constructor() public {
			my_addr = msg.sender; // 현재 생성한 계정값.(주소형), 이 컨트랙의 주인은 현재 배포 계정이다. 라는 뜻.
		}
	function getBalance() public view returns (uint256) {
		return my_addr.balance;
		}

	fallback() external {
	  revert();
	}

	modifier contractIsNFTOwner(address _repoAddress, uint256 _tokenId) {
	//해당 contract가 특정 nft 소유권을 가지고 있는지 확인하는 modifier
	  address nftOwner = MyNFT(_repoAddress).ownerOf(_tokenId);
	  // import한 MyNFT에 contract address를 넣고, ownerOf(tokenId) 함수로 해당 토큰의 소유자 어드레스를 가져옴
	  require(nftOwner == address(this)); //require를 통해 일치하면 다음 프로세스 진행
	  // address(this)는 contract의 address 반환하는 함수
	  _;
	}

	function createAuction(address _repoAddress, uint256 _tokenId, string memory _auctionTitle, uint256 _price) public contractIsNFTOwner(_repoAddress, _tokenId) returns(bool) {
		// 새 auction을 생성하는 함수
		uint auctionId = auctions.length;
		Auction memory newAuction;
		newAuction.name = _auctionTitle;
		newAuction.price = _price;
		// newAuction.metadata = _metadata;
		newAuction.tokenId = _tokenId;
		newAuction.repoAddress = _repoAddress;
		newAuction.owner = msg.sender;
		newAuction.active = true;
        newAuction.finalized = false;

		auctions.push(newAuction);
		require(auctions.length != 0);
		auctionOwner[msg.sender].push(auctionId);

		emit AuctionCreated(msg.sender, auctionId);
		return true;
	}

	// function finalizeAuction(uint _auctionId, address _to) public payable {
	// 	//auction을 소유자에게 전달하는 함수
	// 	Auction memory myAuction = auctions[_auctionId];
	// 	if(approveAndTransfer(address(this), _to, myAuction.repoAddress, myAuction.tokenId)){
	// 		//받는 어드레스에 소유권이 승인되고 전달되는 함수, 여기가 완료되면 해당 옥션의 상태가 종료로 바뀜
	// 		//그 다음 auctionfinalized 이벤트를 송출함
	// 	    auctions[_auctionId].active = false;
	// 	    auctions[_auctionId].finalized = true;

	// 		require(auctions[_auctionId].finalized, "success");
	// 	    emit AuctionFinalized(msg.sender, _auctionId);
			
	// 	}

	function finalizeAuction(uint _auctionId, address _to) public {
		Auction memory myAuction = auctions[_auctionId];
		if(approveAndTransfer(address(this), _to, myAuction.repoAddress, myAuction.tokenId)){
		    auctions[_auctionId].active = false;
		    auctions[_auctionId].finalized = true;
			require(auctions[_auctionId].finalized, "success");
		    emit AuctionFinalized(msg.sender, _auctionId);
		}
	}


	// myNFT 컨트랙트에  컨트랙트 address를 넣고, 인스턴스를 가져온 후, 
	// 인스턴스의 approve(_to, _tokenId)를 통해 해당 토큰을 받는 어드레스(_to)를 승인
	function approveAndTransfer(address _from, address _to, address _repoAddress, uint256 _tokenId) internal returns(bool)  {
		// internal 함수, 컨트랙트 내부에서만 호출 가능
		MyNFT remoteContract = MyNFT(_repoAddress);
		// transferFrom을 통해 해당 어드레스로 전송한다.
		remoteContract.approve(_to, _tokenId);
		remoteContract.transferFrom(_from, _to, _tokenId);
		return true;
	}

    function getCount() public view returns(uint) {
		return auctions.length;
	}

	function getAuctionsOf(address _owner) public view  returns(uint[] memory) {
		uint[] memory ownedAuctions = auctionOwner[_owner];
		return ownedAuctions;
	}

	function getAuctionsCountOfOwner(address _owner) public view returns(uint) {
		return auctionOwner[_owner].length;
	}

	function getAuctionById(uint _auctionId) public view returns(
		string memory name,
		uint256 price,
		// string metadata,
		uint256 tokenId,
		address repoAddress,
		address owner,
		bool active,
		bool finalized) {
		Auction memory auc = auctions[_auctionId];
		return (
			auc.name,
			auc.price,
			// auc.metadata,
			auc.tokenId,
			auc.repoAddress,
			auc.owner,
			auc.active,
			auc.finalized);
	}

	event AuctionPayed(address buyer, address seller, uint _price);
	event AuctionCreated(address _owner, uint _auctionId);
	event AuctionFinalized(address _owner, uint _auctionId); //거래가 끝난 후 송출되는 이벤트
}
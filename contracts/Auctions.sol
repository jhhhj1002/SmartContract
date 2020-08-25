pragma solidity ^0.4.23;

import "./MyNFT.sol";

contract Auctions {
	Auction[] public auctions;
 	mapping(address => uint[]) public auctionOwner;

	struct Auction {
	  string name; // 제목
	  uint256 price; // 가격
	  string metadata; // 메타데이터 : ipfs hash
	  uint256 tokenId; // 토큰 아이디
	  address repoAddress; // nft 컨트랙트 어드레스
	  address owner; // 소유자				
	  bool active; //활성화 여부
	  bool finalized; //판매 종료여부
	}

	function() public {
	  revert();
	}

	modifier contractIsNFTOwner(address _repoAddress, uint256 _tokenId) {
	  address nftOwner = MyNFT(_repoAddress).ownerOf(_tokenId);
	  require(nftOwner == address(this));
	  _;
	}

	function createAuction(address _repoAddress, uint256 _tokenId, string _auctionTitle, string _metadata, uint256 _price) public contractIsNFTOwner(_repoAddress, _tokenId) returns(bool) {
		uint auctionId = auctions.length;
		Auction memory newAuction;
		newAuction.name = _auctionTitle;
		newAuction.price = _price;
		newAuction.metadata = _metadata;
		newAuction.tokenId = _tokenId;
		newAuction.repoAddress = _repoAddress;
		newAuction.owner = msg.sender;
		newAuction.active = true;
        newAuction.finalized = false;

		auctions.push(newAuction);
		auctionOwner[msg.sender].push(auctionId);

		emit AuctionCreated(msg.sender, auctionId);
		return true;
	}

	function finalizeAuction(uint _auctionId, address _to) public {
		Auction memory myAuction = auctions[_auctionId];
		if(approveAndTransfer(address(this), _to, myAuction.repoAddress, myAuction.tokenId)){
		    auctions[_auctionId].active = false;
		    auctions[_auctionId].finalized = true;
		    emit AuctionFinalized(msg.sender, _auctionId);
		}
	}

	function approveAndTransfer(address _from, address _to, address _repoAddress, uint256 _tokenId) internal returns(bool) {
		MyNFT remoteContract = MyNFT(_repoAddress);
		remoteContract.approve(_to, _tokenId);
		remoteContract.transferFrom(_from, _to, _tokenId);
		return true;
	}

    function getCount() public constant returns(uint) {
		return auctions.length;
	}

	function getAuctionsOf(address _owner) public constant returns(uint[]) {
		uint[] memory ownedAuctions = auctionOwner[_owner];
		return ownedAuctions;
	}

	function getAuctionsCountOfOwner(address _owner) public constant returns(uint) {
		return auctionOwner[_owner].length;
	}

	function getAuctionById(uint _auctionId) public constant returns(
		string name,
		uint256 price,
		string metadata,
		uint256 tokenId,
		address repoAddress,
		address owner,
		bool active,
		bool finalized) {
		Auction memory auc = auctions[_auctionId];
		return (
			auc.name,
			auc.price,
			auc.metadata,
			auc.tokenId,
			auc.repoAddress,
			auc.owner,
			auc.active,
			auc.finalized);
	}

	event AuctionCreated(address _owner, uint _auctionId);
	event AuctionFinalized(address _owner, uint _auctionId);
}

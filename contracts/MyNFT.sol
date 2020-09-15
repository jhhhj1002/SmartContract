pragma solidity  >=0.4.21;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

// 제플린의 ERC21Token 컨트랙트 파일을 임포트하고, 이를 현재 컨트랙트로 상속받는다.
contract MyNFT is ERC721Token {
    constructor (string _name, string _symbol) public
        ERC721Token(_name, _symbol) {}

    // 생성자로서, 등록하고자 하는 토큰의 이름, 심벌이 기본 값으로 들어간다.
    //토큰을 등록할 때 소유권의 어드레스, 토큰의 유니크 아이디, 세부 정보를 포함하는 uri가 파리미터로 전달된다.
    function registerUniqueToken( 
        address _to,
        uint256 _tokenId
        // string  _tokenURI
    ) public
    {
          // import한 ERC21 라이브러리의 새 토큰을 생성하는 _mint 함수를 호출한다.
        // 여기서 토큰의 아이디와 그 토큰을 소유할 계정의 어드레스를 파라미터로 넘긴다.
        super._mint(_to, _tokenId);

        // 세부 메타 데이터를 해당 토큰 아이디와 함께 넘기는 함수로서, 이 역시 임포트한 상위의 ERC21 라이브러리 함수인 _setTokenURI를 호출
        // super._setTokenURI(_tokenId, _tokenURI);

        // 토큰 등록 시에 다음과 같이 호출
        emit TokenRegistered(_to, _tokenId);
    }

    // 토큰 등록에 대한 이벤트 정의
   event TokenRegistered(address _by, uint256 _tokenId);
}


// 이 컨트랙트의 배포를 위해서 migration 파일 2_nft_migration.js 생성
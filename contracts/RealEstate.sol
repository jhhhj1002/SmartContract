pragma solidity ^0.4.23;

contract RealEstate {
    struct Buyer {
        address buyerAddress;
        bytes32 name;
        uint age;
    }

    // 매입자 정보 보관 (읽기 전용함수에서 쓴다. )
    mapping (uint => Buyer) public buyerInfo; //id와 (키) 매물자 정보(값)
    address public owner;
    address[10] public buyers;

    // event 내용도 block에 저장된다. - 그래서 log라 함.
    event LogBuyRealEstate(
        address _buyer, // 어떤 계정에서, 
        uint _id        // 몇번 매물을 구입했다 - 라고 메세지를 보내기 위함.
    );

    // 생성자
    // class 멤버 변수 초기화
    // 배포할때 단 한번만 생성하고 끝난다. 그 이후로 호출 못한다. 
    // 배포할때 계정 = 컨트랙트 소유자
    constructor() public {
        owner = msg.sender; // 현재 생성한 계정값.(주소형), 이 컨트랙의 주인은 현재 배포 계정이다. 라는 뜻.
    }

    // blockchain에 저장되는 중요 함수.
    function buyRealEstate(uint _id, bytes32 _name, uint _age) public payable {
        // 1. 유효성 체크
        require(_id >= 0 && _id <= 9); // 매물의 id
        buyers[_id] = msg.sender;
        buyerInfo[_id] = Buyer(msg.sender, _name, _age);

        // owner에게 매입가를 전송함.
        owner.transfer(msg.value); //이게 작동해서 첫번째 계정으로 송금되고, 두번째 계정이 깎임.
        emit LogBuyRealEstate(msg.sender, _id);

    }

    // 가시성 public
    // 타입제어자 view
    function getBuyerInfo(uint _id) public view returns (address, bytes32, uint) {  
        // 저장 위치는 메모리이기 때문에 함수가 끝나면 휘발한다. 
        Buyer memory buyer = buyerInfo[_id];
        return (buyer.buyerAddress, buyer.name, buyer.age);
    }

    // 매입자 정보 리턴
    // 배열크기와 파라미터를 맞춘다. 
    // // app.getAllBuyers(); 10개의 고정 사이즈 리턴
    // 읽기 전용은 가스를 소모하지 않는다.
    function getAllBuyers() public view returns (address[10]) {
        return buyers;
    }

}
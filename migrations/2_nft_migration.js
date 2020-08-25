const MyNFT = artifacts.require("./MyNFT.sol");
const Auctions = artifacts.require("./Auctions.sol");

module.exports = async function(deployer) {
  deployer.deploy(MyNFT, "AvarCat", "ACat")
  deployer.deploy(Auctions)
};
// deploy 시에 MyNFT 컨트랙트 생성자에 들어가는 인자를 넣는다
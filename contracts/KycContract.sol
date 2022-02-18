pragma solidity ^0.6.0;

//import "@openzeppelin/contracts/access/Ownable.sol";
/** For this test app, anyone can whitelist their address, not just the owner
contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns(bool) {
        return allowed[_addr];
    }
}
*/

contract KycContract {
    mapping(address => bool) allowed;

    function setKycCompleted(address _addr) public {
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns(bool) {
        return allowed[_addr];
    }
}
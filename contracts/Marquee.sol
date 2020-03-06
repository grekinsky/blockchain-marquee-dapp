pragma solidity >=0.4.21 <0.7.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/ownership/Ownable.sol';
import './StringUtil.sol';

contract Marquee is Ownable {
    uint256 public constant _blockSample = 40;
    // uint public _newBlockDuration = 15000;
    mapping(uint256 => string) private reservedSpaces;
    mapping(uint256 => address) private spaceOwners;

    // Event definition
    event NewReservedSpace(
        address indexed owner,
        uint256 indexed which,
        string data
    );

    function getCurrentSpaceAvailability()
        public
        view
        returns (bool[_blockSample] memory)
    {
        uint256 currentBlockNumber = block.number;
        bool[_blockSample] memory spaces;

        for (uint8 b = 0; b < _blockSample; b++) {
            spaces[b] = StringUtil.compare(
                reservedSpaces[currentBlockNumber + b],
                ''
            );
        }

        return spaces;
    }

    function getMySpaces() public view returns (bool[_blockSample] memory) {
        uint256 currentBlockNumber = block.number;
        bool[_blockSample] memory spaces;

        for (uint8 b = 0; b < _blockSample; b++) {
            spaces[b] = spaceOwners[currentBlockNumber + b] == msg.sender;
        }

        return spaces;
    }

    function getCurrentBlockNumber() public view returns (uint256) {
        return block.number;
    }

    function reserveSpace(uint256 blockNumber, string memory data)
        public
        returns (bool success)
    {
        uint256 currentBlockNumber = block.number;
        require(
            blockNumber >= currentBlockNumber &&
                blockNumber <= currentBlockNumber + _blockSample,
            'INVALID_BLOCK_NUMBER'
        );
        require(
            StringUtil.compare(reservedSpaces[blockNumber], '') &&
                spaceOwners[blockNumber] == address(0),
            'BLOCK_UNAVAILABLE'
        );
        spaceOwners[blockNumber] = msg.sender;
        reservedSpaces[blockNumber] = data;
        emit NewReservedSpace(msg.sender, blockNumber, data);
        return true;
    }

    function getCurrentSpace() public view returns (string memory) {
        uint256 currentBlockNumber = block.number;
        return reservedSpaces[currentBlockNumber];
    }

}

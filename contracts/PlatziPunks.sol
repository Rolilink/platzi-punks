// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract PlatziPunks is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _idCounter;
    uint256 public maxSupply;

    constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
      maxSupply = _maxSupply;
    }

    function mint() public payable {
      require( msg.value >= 0.05 ether, "To mint a PlatziPunk you require to send 0.05 ethers" );
      require( _idCounter.current() < maxSupply, "Cannot mint more PlatziPunks because it exceded max supply.");
      payable(owner()).transfer(msg.value);
      _safeMint(msg.sender, _idCounter.current());
      _idCounter.increment();
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
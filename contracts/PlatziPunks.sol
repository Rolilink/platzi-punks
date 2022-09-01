// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";
import "./PlatziPunksDNA.sol";


contract PlatziPunks is ERC721, ERC721Enumerable, Ownable, PlatziPunksDNA {
  using Counters for Counters.Counter;
  Counters.Counter private _idCounter;
  uint256 public maxSupply;
  mapping (uint256 => uint256) public tokenDNA;

  constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
    maxSupply = _maxSupply;
  }

  function mint() public payable {
    require( msg.value == 0.05 ether, "The cost to mint a PlatziPunk is 0.05 ethers." );
    require( _idCounter.current() < maxSupply, "Cannot mint more PlatziPunks because it exceded max supply.");

    payable(owner()).transfer(msg.value);
    
    tokenDNA[_idCounter.current()] = deterministicPseudoRandomDNA(_idCounter.current(), msg.sender);
    
    _safeMint(msg.sender, _idCounter.current());
    
    _idCounter.increment();
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://avataaars.io/";
  }

  function _paramsURI(uint256 _dna) internal view returns (string memory) {
    string memory params;

     {
            params = string(
                abi.encodePacked(
                    "accessoriesType=",
                    getAccessoriesType(_dna),
                    "&clotheColor=",
                    getClotheColor(_dna),
                    "&clotheType=",
                    getClotheType(_dna),
                    "&eyeType=",
                    getEyeType(_dna),
                    "&eyebrowType=",
                    getEyeBrowType(_dna),
                    "&facialHairColor=",
                    getFacialHairColor(_dna),
                    "&facialHairType=",
                    getFacialHairType(_dna),
                    "&hairColor="
                )
            );
        }

        {
          params = string(
            abi.encodePacked(
                params,
                getHairColor(_dna),
                "&hatColor=",
                getHatColor(_dna),
                "&graphicType=",
                getGraphicType(_dna),
                "&mouthType=",
                getMouthType(_dna),
                "&skinColor=",
                getSkinColor(_dna)
            )
          );
        }
    
    return string(abi.encodePacked(params, "&topType=", getTopType(_dna)));
  }

  function imageByDNA(uint256 _dna) public view returns (string memory) {
    string memory baseURI = _baseURI();
    string memory paramsURI = _paramsURI(_dna);

    return string(abi.encodePacked(baseURI, "?", paramsURI));
  }

  function tokenURI(uint256 tokenId) public view override returns( string memory ) {
    require(_exists(tokenId), "ERC721 Metadata: URI query for nonexistent token.");

    string memory jsonURI = Base64.encode(abi.encodePacked(
      '{ "name": "PlatziPunks #',
      Strings.toString(tokenId),
      '", "description": "Platzi Punks are randomized Avataaars stored on chain to teach DApp development on Platzi", "image": "',
      imageByDNA(tokenDNA[tokenId]),
      '" }'
    ));

    return string(abi.encodePacked("data:application/json;base64,", jsonURI));
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
const PlatziPunks = artifacts.require("PlatziPunks");
const {
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const atob = require('atob');

const jsonFromBase64 = (base64String) => JSON.parse(atob(base64String.split(',')[1]));

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("PlatziPunks", function (accounts) {
  const ownerAccount = accounts[0];

  it("Platzi punk should have the correct name", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();
    const name = await platziPunksInstance.name.call();

    assert.equal(
      name,
      "PlatziPunks",
    );
  });

  it("Platzi punk should have the correct symbol", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();
    const symbol = await platziPunksInstance.symbol.call();

    assert.equal(
      symbol,
      "PLPKS",
    );
  });

  it("PlatziPunk contract should have the correct owner", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();

    const owner = await platziPunksInstance.owner.call();
    
    assert.equal(
      owner,
      ownerAccount,
    );
  });

  it("PlatziPunk contract should have the correct max supply", async function () {
    const MAX_SUPPLY = 2;
    const platziPunksInstance = await PlatziPunks.new(MAX_SUPPLY);

    const maxSupply = await platziPunksInstance.maxSupply.call();
    assert.equal(
      maxSupply.toString(),
      `${maxSupply}`,
    );
  });

  it("PlatziPunk contract should mint to the correct owner when sent enough ether", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();
    const ether = web3.utils.toWei("0.05", "ether");
    const user = accounts[1];

    await platziPunksInstance.mint({
      from: user,
      value: ether
    });

    const newlyMintedUser = await platziPunksInstance.ownerOf(0)
    
    
    assert.equal(
      user,
      newlyMintedUser,
    );
  });

  it("PlatziPunk contract should revert the transaction when not sent enough ether", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();
    const ether = web3.utils.toWei("0.04", "ether");
    const user = accounts[1];

    const txPromise = platziPunksInstance.mint({
      from: user,
      value: ether
    });
    
    await expectRevert(
      txPromise,
      "The cost to mint a PlatziPunk is 0.05 ethers.",
    );
  });

  it("PlatziPunk contract shouldn't mint more than the max supply of tokens", async function () {
    const MAX_SUPPLY = 2;
    const platziPunksInstance = await PlatziPunks.new(MAX_SUPPLY);

    const ether = web3.utils.toWei("0.05", "ether");
    const user = accounts[1];

    await platziPunksInstance.mint({
      from: user,
      value: ether
    });

    await platziPunksInstance.mint({
      from: user,
      value: ether
    });
    
    const txPromise = platziPunksInstance.mint({
      from: user,
      value: ether
    });
    
    
    await expectRevert(
      txPromise,
      "Cannot mint more PlatziPunks because it exceded max supply.",
    );
  });

  it("Two PlatziPunk images shouldn't be identical", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();

    const ether = web3.utils.toWei("0.05", "ether");
    const user = accounts[1];

    await platziPunksInstance.mint({
      from: user,
      value: ether
    });

    await platziPunksInstance.mint({
      from: user,
      value: ether
    });
    
    const token1Uri = await platziPunksInstance.tokenURI(0);
    const token2Uri = await platziPunksInstance.tokenURI(1);

   assert.notEqual(
    jsonFromBase64(token1Uri).image,
    jsonFromBase64(token2Uri).image,
  );
  });
});

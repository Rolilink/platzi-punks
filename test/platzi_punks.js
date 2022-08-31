const PlatziPunks = artifacts.require("PlatziPunks");

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
});

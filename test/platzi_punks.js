const PlatziPunks = artifacts.require("PlatziPunks");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("PlatziPunks", function (accounts) {
  it("Platzi punk should have the correct name", async function () {
    const platziPunksInstance = await PlatziPunks.deployed();
    console.log(platziPunksInstance.name);
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
});

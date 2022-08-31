var PlatziPunksContract = artifacts.require("PlatziPunks");

module.exports = function(_deployer) {
  _deployer.deploy(PlatziPunksContract);
};

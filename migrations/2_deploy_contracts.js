const StringUtil = artifacts.require('StringUtil');
const Marquee = artifacts.require('Marquee');

module.exports = function(deployer) {
    deployer.deploy(StringUtil);
    deployer.link(StringUtil, Marquee);
    deployer.deploy(Marquee);
};

// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("VotingAppModule", (m) => {

  const candidates = m.getParameter("candidates", ["Oussema Joudi"]);
  const cids = m.getParameter("cids", ["bafkreibyefpwhq6exiiscrgwjvvrxjdps7nzguti6eyphrmp6jjt6rcyga"]);
  const VotingApp = m.contract("VotingApp", [candidates, cids]);

  return { VotingApp };
});

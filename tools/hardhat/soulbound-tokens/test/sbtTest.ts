// This is an example test file. Hardhat will run every *.ts file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    // const sbt = await ethers.getContractFactory("SoulBoundToken");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract() and await
    // its waitForDeployment() method, which happens onces its transaction has been
    // mined.

    const sbtContract = await ethers.deployContract("SoulBoundToken");

    await sbtContract.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { sbtContract, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should mint SBT to owner", async function () {
      const { sbtContract, owner } = await loadFixture(deployTokenFixture);
      const safemint = await sbtContract.safeMint(owner.address);
      expect(await sbtContract.ownerOf(0)).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should prohibit token transfer using transferFrom", async function () {
      const { sbtContract, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );

      const safemintTx = await sbtContract.safeMint(owner.address);

      // prohibit token transfer of token id (0) from owner to addr1
      await expect(
        sbtContract.transferFrom(owner.address, addr1.address, 0)
      ).to.be.reverted;
  });

  it("Should prohibit token transfer using safeTransferFrom", async function () {
    const { sbtContract, owner, addr1 } = await loadFixture(
      deployTokenFixture
    );

    const safemintTx = await sbtContract.safeMint(owner.address);

    // prohibit token transfer of token id (0) from owner to addr1
    await expect(sbtContract['safeTransferFrom(address,address,uint256)'](
      owner.address,
      addr1.address,
      0 
  )).to.be.reverted;
});


});

})
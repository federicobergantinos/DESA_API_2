const MetaMaskAccountCreator = require('../../../utils/MetaMaskAccountCreator');
const MetamaskAccount = require('../../../entities/metamaskAccount');

const populateMetamaskAccounts = async () => {
  console.log("")
  try {
    for (let i = 0; i < 10; i++) { // Crear 10 cuentas de ejemplo
      const metamaskAccount = MetaMaskAccountCreator.createAccount();

      await MetamaskAccount.create({
        accountNumber: metamaskAccount.address,
        mnemonic: metamaskAccount.mnemonic,
        privateKey: metamaskAccount.privateKey,
        used: false,
      });
    }

    console.log('Metamask accounts populated successfully');
  } catch (error) {
    console.error(`Error populating Metamask accounts: ${error}`);
  }
};

module.exports = populateMetamaskAccounts;

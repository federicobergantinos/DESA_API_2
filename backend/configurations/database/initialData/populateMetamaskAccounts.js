const {
  MetaMaskAccountCreator
} = require('../../../utils/MetaMaskAccountCreator');
const { MetamaskAccount, User } = require('../../../entities/associateModels');

const populateMetamaskAccounts = async () => {
  try {
    // Buscar el usuario de Wallet Company
    const walletCompany = await User.findOne({ where: { email: 'xwallet.company@gmail.com' } });

    if (!walletCompany) {
      throw new Error('Wallet Company user not found');
    }

    // Crear la cuenta de MetaMask de Wallet Company
    const walletCompanyAccount = {
      accountNumber: '0x8A0da10861c24A818B600F971a983432044bBcfd',
      mnemonic: "mnemonic",
      privateKey: 'c068f69fdaadd9896f96ce0eafd1fa5e21aefa2c43ead0b6d085c9a5459d1c25', 
      userId: walletCompany.id,
      used: true,
    };

    await MetamaskAccount.create(walletCompanyAccount);
    console.log('Wallet Company MetaMask account created');

    // Crear cuentas adicionales de MetaMask
    for (let i = 0; i < 10; i++) {
      const metamaskAccount = await MetaMaskAccountCreator.createAccount();

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

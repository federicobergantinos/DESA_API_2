const Account = require('../entities/account');
const MetamaskAccount = require('../entities/metamaskAccount');
const User = require('../entities/user');
const NotFound = require('../Errors/NotFound');
const createLogger = require('../configurations/Logger');
const {
  MetaMaskAccountCreator,
} = require('../utils/MetaMaskAccountCreator');

const logger = createLogger(__filename);

const findMetamaskAccountByAccountNumber = async (accountNumber) => {
  const account = await MetamaskAccount.findOne({
    where: { accountNumber: accountNumber },
    attributes: ['privateKey'], // Solo obtener el atributo privateKey
  });
  return account ? account.privateKey : null; // Devolver solo el privateKey o null si no se encuentra
};

const createAccount = async (accountData) => {
  try {
    // Crear una cuenta de MetaMask
    const metamaskAccount = await MetaMaskAccountCreator.createAccount();
    accountData.metamaskAddress = metamaskAccount.address;

    // Guardar la cuenta de MetaMask en la base de datos
    await MetamaskAccount.create({
      accountNumber: metamaskAccount.address,
      mnemonic: metamaskAccount.mnemonic,
      privateKey: metamaskAccount.privateKey,
      used: false,
    });

    const newAccount = await Account.create(accountData);
    return {
      id: newAccount.id,
    };
  } catch (error) {
    throw error;
  }
};

const findAccountByAccountNumber = async (accountNumber) => {
  const account = await Account.findOne({
    where: { accountNumber: accountNumber },
    include: [{ model: User, as: 'user' }],
  });
  return account;
};

const findAccountById = async (accountId) => {
  const account = await Account.findByPk(accountId);
  if (account === null) {
    throw new NotFound('Account not found');
  }
  return account;
};

const findAccountByUserId = async (userId) => {
  const account = await Account.findAll({
    where: { userId: userId },
    order: [['id', 'ASC']],
  });
  if (!account) {
    throw new NotFound('No account found for the given user ID');
  }
  return account;
};

const deactivateAccountsByUserId = async (userId) => {
  try {
    await Account.update(
      { accountStatus: 'deactivated' },
      { where: { userId: userId } }
    );
  } catch (error) {
    throw error;
  }
};

const getAvailableMetamaskAccountsService = async () => {
  try {
    const accounts = await MetamaskAccount.findAll({
      where: { used: false },
      order: [['id', 'ASC']],
    });
    return accounts;
  } catch (error) {
    throw error;
  }
};

const markMetamaskAccountAsUsedService = async (accountNumber) => {
  try {
    await MetamaskAccount.update(
      { used: true },
      { where: { accountNumber: accountNumber } }
    );
  } catch (error) {
    throw error;
  }
};

const updateUserAccountStatusByEmail = async (email, status) => {
  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Actualizar el estado de las cuentas del usuario
    await Account.update(
      { accountStatus: status === 'APPROVED' ? 'validated' : 'rejected' },
      { where: { userId: user.id, accountStatus: 'pending' } }
    );
    logger.info(`Accounts for user with email ${email} updated to ${status}`);
  } catch (error) {
    console.error(`Error updating account status: ${error.message}`);
    throw error;
  }
};

const findAccountByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  const accounts = await Account.findAll({ where: { userId: user.id } });
  if (!accounts || accounts.length === 0) {
    throw new Error(`No accounts found for user with email ${email}`);
  }

  const accountsDict = {
    USD: null,
    ARS: null,
    XCN: null,
  };

  accounts.forEach((account) => {
    if (account.accountCurrency === 'USD') {
      accountsDict.USD = account.accountNumber;
    } else if (account.accountCurrency === 'ARS') {
      accountsDict.ARS = account.accountNumber;
    } else if (account.accountCurrency === 'XCN') {
      accountsDict.XCN = account.accountNumber;
    }
  });

  return accountsDict;
};

module.exports = {
  createAccount,
  findAccountByAccountNumber,
  findAccountById,
  findAccountByEmail,
  findAccountByUserId,
  deactivateAccountsByUserId,
  getAvailableMetamaskAccountsService,
  markMetamaskAccountAsUsedService,
  updateUserAccountStatusByEmail,
  findMetamaskAccountByAccountNumber,
};

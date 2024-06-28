const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransactionStatus,
} = require('../services/transactionService');
const {
  findMetamaskAccountByAccountNumber,
  findAccountByEmail,
} = require('../services/accountService');
const { sendResponse } = require('../configurations/utils');
const createLogger = require('../configurations/Logger');
const { sendMessageToSNS } = require('../utils/snsSender');
const { v4: uuidv4 } = require('uuid');
const logger = createLogger(__filename);
const {
  MetaMaskAccountCreator,
  transferGasToAccount,
  estimateGasForOperations,
} = require('../utils/MetaMaskAccountCreator');

const create = async (req, res) => {
  try {
    const transactionId = uuidv4(); // Generar un UUID para ambas transacciones
    let accountNumberOriginKey = null;
    let accountNumberDestinationKey = null;

    const transactionData = {
      ...req.body,
      transactionId,
    };

    // Determinar el operationType según el typeTransaction
    let operationType;
    let payloadData;
    const WalletCompanyXCNAccount = await findAccountByEmail(
      'xwallet.company@gmail.com'
    );

    switch (transactionData.typeTransaction) {
      case 'BuyXCN':
        operationType = 'CreateBuyXCN';
        // Intercambio USD || ARS
        transactionBuyXCN = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberOrigin,
          accountNumberDestination:
            transactionData.currencyOrigin === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          status: 'confirmed',
        };
        await createTransaction(transactionBuyXCN);
        transactionBuyXCN = {
          ...transactionData,
          accountNumberOrigin:
            transactionData.currencyOrigin === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
          accountNumberDestination: transactionData.accountNumberOrigin,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          status: 'confirmed',
        };
        await createTransaction(transactionBuyXCN);

        // Intercambio XCN
        transactionBuyXCN = {
          ...transactionData,
          accountNumberOrigin: WalletCompanyXCNAccount.XCN,
          accountNumberDestination: transactionData.accountNumberDestination,
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyDestination,
          amountOrigin: -Math.abs(transactionData.amountDestination), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountDestination), // Asegurar que el monto es negativo
        };
        payloadData = transactionBuyXCN;
        await createTransaction(transactionBuyXCN);
        transactionBuyXCN = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberDestination,
          accountNumberDestination: WalletCompanyXCNAccount.XCN,
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyDestination,
          amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
        };
        await createTransaction(transactionBuyXCN);
        break;
      case 'SellXCN':
        operationType = 'CreateSellXCN';
        // Intercambio USD || ARS
        transactionSellXCN = {
          ...transactionData,
          accountNumberOrigin:
            transactionData.currencyDestination === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
          accountNumberDestination: transactionData.accountNumberDestination,
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyDestination,
          amountOrigin: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          status: 'confirmed',
        };
        await createTransaction(transactionSellXCN);
        transactionSellXCN = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberDestination,
          accountNumberDestination:
            transactionData.currencyDestination === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyDestination,
          amountOrigin: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          status: 'confirmed',
        };
        await createTransaction(transactionSellXCN);

        // Intercambio XCN
        transactionSellXCN = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberOrigin,
          accountNumberDestination: WalletCompanyXCNAccount.XCN,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: -Math.abs(transactionData.amountDestination), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountDestination), // Asegurar que el monto es negativo
        };
        payloadData = transactionSellXCN;
        await createTransaction(transactionSellXCN);
        transactionSellXCN = {
          ...transactionData,
          accountNumberOrigin: WalletCompanyXCNAccount.XCN,
          accountNumberDestination: transactionData.accountNumberOrigin,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
        };
        await createTransaction(transactionSellXCN);
        break;
      case 'EmitXCN':
        operationType = 'CreateEmitXCN';
        transactionEmitXCN = {
          ...transactionData,
          accountNumberOrigin: WalletCompanyXCNAccount.XCN,
          accountNumberDestination: WalletCompanyXCNAccount.XCN,
          currencyOrigin: 'XCoin',
          currencyDestination: 'XCoin',
          amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
        };
        await createTransaction(transactionEmitXCN);
        payloadData = transactionEmitXCN;
        break;
      case 'Transfer':
      default:
        operationType = 'CreateTransferXCN';
        transactionTransfer = {
          ...transactionData,
          amountOrigin: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountDestination), // Asegurar que el monto es negativo
          status:
            transactionData.currencyOrigin === 'USD' ||
            transactionData.currencyOrigin === 'ARS'
              ? 'confirmed'
              : transactionData.status,
        };
        await createTransaction(transactionTransfer);
        payloadData = transactionTransfer;

        transactionTransfer = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberDestination,
          accountNumberDestination: transactionData.accountNumberOrigin,
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          status:
            transactionData.currencyOrigin === 'USD' ||
            transactionData.currencyOrigin === 'ARS'
              ? 'confirmed'
              : transactionData.status,
        };
        await createTransaction(transactionTransfer);
        break;
    }


    // Crear el payload para SNS solo para la transacción original
    if (
      payloadData.currencyOrigin === 'XCoin' &&
      payloadData.currencyDestination === 'XCoin'
    ) {
      // Obtener las claves privadas de las cuentas de origen y destino
      if (payloadData.currencyOrigin === 'XCoin') {
        accountNumberOriginKey = await findMetamaskAccountByAccountNumber(
          payloadData.accountNumberOrigin
        );
        // Transferir gas desde la cuenta principal a la cuenta de origen si es necesario
        const gasAmount = await estimateGasForOperations(3); // Estima el gas para 3 operaciones
        await transferGasToAccount(payloadData.accountNumberOrigin, gasAmount);
      }
      if (payloadData.currencyDestination === 'XCoin') {
        accountNumberDestinationKey = await findMetamaskAccountByAccountNumber(
          payloadData.accountNumberDestination
        );
      }
      const payload = {
        operationType: operationType,
        data: {
          accountNumberOrigin: payloadData.accountNumberOrigin,
          accountNumberOriginKey: accountNumberOriginKey,
          accountNumberDestination: payloadData.accountNumberDestination,
          accountNumberDestinationKey: accountNumberDestinationKey,
          transactionId: payloadData.transactionId,
          name: payloadData.name,
          description: payloadData.description,
          amountOrigin: Math.abs(payloadData.amountOrigin),
          amountDestination: Math.abs(payloadData.amountDestination),
          currencyOrigin: payloadData.currencyOrigin,
          currencyDestination: payloadData.currencyDestination,
          status: payloadData.status,
          date: payloadData.date,
        },
      };

      // Enviar mensaje a SNS
      await sendMessageToSNS(payload);
    }

    return sendResponse(res, 201, {
      id: transactionId,
      message: 'Transacción creada con éxito',
    });
  } catch (error) {
    console.error(`Error en la creación de la transacción: ${error}`);
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'Ha ocurrido una excepción',
    });
  }
};

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Asegúrate de proporcionar un valor por defecto
  const limit = parseInt(req.query.limit) || 20; // Límite de ítems por página
  const offset = page * limit;
  const accountNumberOrigin = req.query.accountNumber;

  try {
    const response = await getTransactions({
      limit,
      offset,
      accountNumberOrigin,
    });

    return sendResponse(res, 200, response);
  } catch (error) {
    console.error(` ${error}`);
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    });
  }
};

const getById = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const response = await getTransaction(transactionId);
    const transaction = response.dataValues;

    return sendResponse(res, 200, {
      ...transaction,
    });
  } catch (error) {
    console.error(` ${error}`);
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    });
  }
};

const calculateAccountBalance = async (req, res) => {
  try {
    const accountNumberOrigin = req.query.accountNumber;
    const page = parseInt(req.query.page) || 0; // Asegúrate de proporcionar un valor por defecto
    const limit = parseInt(req.query.limit) || 20; // Límite de ítems por página
    const offset = page * limit;

    const transactions = await getTransactions({
      accountNumberOrigin,
      limit,
      offset,
    });

    let balance = 0;
    transactions.forEach((transaction) => {
      balance += transaction.amountOrigin;
    });

    return sendResponse(res, 200, balance);
  } catch (error) {
    console.error('Error calculando el saldo de la cuenta:', error);
    throw error;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  calculateAccountBalance,
};

const {
  createTransaction,
  getTransactions,
  getTransaction,
<<<<<<< HEAD
  updateTransactionStatus,
} = require('../services/transactionService');
const {
  findMetamaskAccountByAccountNumber,
  findAccountByEmail,
=======
  updateTransactionStatus
} = require('../services/transactionService');
const {
  findMetamaskAccountByAccountNumber, 
  findAccountByEmail
>>>>>>> 619e1ef (Unit tests)
} = require('../services/accountService');
const { sendResponse } = require('../configurations/utils');
const createLogger = require('../configurations/Logger');
const { sendMessageToSNS } = require('../utils/snsSender');
const { v4: uuidv4 } = require('uuid');
const logger = createLogger(__filename);
const {
  MetaMaskAccountCreator,
  transferGasToAccount,
<<<<<<< HEAD
  estimateGasForOperations,
=======
  estimateGasForOperations
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
    const WalletCompanyXCNAccount = await findAccountByEmail(
      'xwallet.company@gmail.com'
    );
=======
    const WalletCompanyXCNAccount = await findAccountByEmail('xwallet.company@gmail.com');
>>>>>>> 619e1ef (Unit tests)

    switch (transactionData.typeTransaction) {
      case 'BuyXCN':
        operationType = 'CreateBuyXCN';
        // Intercambio USD || ARS
        transactionBuyXCN = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberOrigin,
<<<<<<< HEAD
          accountNumberDestination:
            transactionData.currencyOrigin === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
=======
          accountNumberDestination: transactionData.currencyOrigin === "USD" ? WalletCompanyXCNAccount.USD : WalletCompanyXCNAccount.ARS,
>>>>>>> 619e1ef (Unit tests)
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
<<<<<<< HEAD
          status: 'confirmed',
=======
>>>>>>> 619e1ef (Unit tests)
        };
        await createTransaction(transactionBuyXCN);
        transactionBuyXCN = {
          ...transactionData,
<<<<<<< HEAD
          accountNumberOrigin:
            transactionData.currencyOrigin === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
=======
          accountNumberOrigin: transactionData.currencyOrigin === "USD" ? WalletCompanyXCNAccount.USD : WalletCompanyXCNAccount.ARS,
>>>>>>> 619e1ef (Unit tests)
          accountNumberDestination: transactionData.accountNumberOrigin,
          currencyOrigin: transactionData.currencyOrigin,
          currencyDestination: transactionData.currencyOrigin,
          amountOrigin: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
<<<<<<< HEAD
          status: 'confirmed',
=======
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
          accountNumberOrigin:
            transactionData.currencyDestination === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
=======
          accountNumberOrigin: transactionData.currencyDestination === "USD" ? WalletCompanyXCNAccount.USD : WalletCompanyXCNAccount.ARS,
>>>>>>> 619e1ef (Unit tests)
          accountNumberDestination: transactionData.accountNumberDestination,
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyDestination,
          amountOrigin: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
          amountDestination: -Math.abs(transactionData.amountOrigin), // Asegurar que el monto es negativo
<<<<<<< HEAD
          status: 'confirmed',
=======
>>>>>>> 619e1ef (Unit tests)
        };
        await createTransaction(transactionSellXCN);
        transactionSellXCN = {
          ...transactionData,
          accountNumberOrigin: transactionData.accountNumberDestination,
<<<<<<< HEAD
          accountNumberDestination:
            transactionData.currencyDestination === 'USD'
              ? WalletCompanyXCNAccount.USD
              : WalletCompanyXCNAccount.ARS,
=======
          accountNumberDestination: transactionData.currencyDestination === "USD" ? WalletCompanyXCNAccount.USD : WalletCompanyXCNAccount.ARS,
>>>>>>> 619e1ef (Unit tests)
          currencyOrigin: transactionData.currencyDestination,
          currencyDestination: transactionData.currencyDestination,
          amountOrigin: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
<<<<<<< HEAD
          status: 'confirmed',
=======
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
          currencyOrigin: 'XCoin',
          currencyDestination: 'XCoin',
          amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
        };
=======
          currencyOrigin: "XCoin",
          currencyDestination: "XCoin",
          amountOrigin: Math.abs(transactionData.amountDestination), // Asegurar que el monto es positivo
          amountDestination: Math.abs(transactionData.amountOrigin), // Asegurar que el monto es positivo
        };
        console.log(transactionEmitXCN)
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
          status:
            transactionData.currencyOrigin === 'USD' ||
            transactionData.currencyOrigin === 'ARS'
              ? 'confirmed'
              : transactionData.status,
=======
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
          status:
            transactionData.currencyOrigin === 'USD' ||
            transactionData.currencyOrigin === 'ARS'
              ? 'confirmed'
              : transactionData.status,
=======
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
        const gasAmount = await estimateGasForOperations(3); // Estima el gas para 3 operaciones
        await transferGasToAccount(payloadData.accountNumberOrigin, gasAmount);
=======
        const gasAmount = await estimateGasForOperations(5); // Estima el gas para 5 operacion
        // await transferGasToAccount(payloadData.accountNumberOrigin, gasAmount);
>>>>>>> 619e1ef (Unit tests)
      }
      if (payloadData.currencyDestination === 'XCoin') {
        accountNumberDestinationKey = await findMetamaskAccountByAccountNumber(
          payloadData.accountNumberDestination
        );
      }
<<<<<<< HEAD

=======
>>>>>>> 619e1ef (Unit tests)
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
<<<<<<< HEAD
          amountOrigin: Math.abs(payloadData.amountOrigin),
          amountDestination: Math.abs(payloadData.amountDestination),
=======
          amountOrigin: payloadData.amountOrigin,
          amountDestination: payloadData.amountDestination,
>>>>>>> 619e1ef (Unit tests)
          currencyOrigin: payloadData.currencyOrigin,
          currencyDestination: payloadData.currencyDestination,
          status: payloadData.status,
          date: payloadData.date,
        },
      };
<<<<<<< HEAD

      // Enviar mensaje a SNS
      await sendMessageToSNS(payload);
=======
      console.log(payload)
      // Enviar mensaje a SNS
      // await sendMessageToSNS(payload);
>>>>>>> 619e1ef (Unit tests)
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

const { Media, Transaction, User } = require("../entities/associateModels");
const BadRequest = require("../Errors/BadRequest");
const { isValidUser } = require("./userService");
const NotFound = require("../Errors/NotFound");
const { Op } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");

const createTransaction = async (transactionData) => {
  const { userId, name, description, amount, currency, status, date } =
    transactionData;

  if (!(await isValidUser(userId))) {
    throw new BadRequest("Invalid User");
  }

  try {
    // Iniciar una transacción con sequelize para garantizar atomicidad
    const result = await sequelize.transaction(async (t) => {
      // Crear la transacción
      const newTransaction = await Transaction.create(
        {
          userId,
          name,
          description,
          amount,
          currency,
          status,
          date,
        },
        { transaction: t }
      );

      return newTransaction;
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getTransactions = async (queryData) => {
  let includeOptions = [
    {
      model: User,
      as: "user",
      where: { id: queryData.userId },
      required: true,
    },
  ];
  const transactions = await Transaction.findAll({
    include: includeOptions,
  });

  return transactions;
};

const getTransaction = async (transactionId) => {
  console.log(transactionId);
  const transaction = await Transaction.findByPk(transactionId);
  console.log(transaction);
  if (transaction === null) {
    throw new NotFound("Transaction not found");
  }

  return transaction;
};
module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
};

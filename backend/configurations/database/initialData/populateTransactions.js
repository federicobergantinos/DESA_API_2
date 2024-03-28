const { Transaction, User } = require("../../../entities/associateModels");
const { transactionsData } = require("./transactionsData");

const populateTransactions = async () => {
  try {
    for (const transactionData of transactionsData) {
      const { name, description, amount, currency, status, date, userId } =
        transactionData;

      // Buscar el usuario por userId
      const user = await User.findByPk(userId);
      if (!user) {
        console.log(`User with id ${userId} not found.`);
        continue; // Saltar esta transacción si el usuario no se encuentra
      }

      // Crear la transacción
      await Transaction.create({
        name,
        description,
        amount,
        currency,
        status,
        date,
        userId: user.id,
      });
    }

    console.log("Transactions table has been populated with initial data.");
  } catch (error) {
    console.error("Error populating Transactions table:", error);
  }
};

module.exports = populateTransactions;

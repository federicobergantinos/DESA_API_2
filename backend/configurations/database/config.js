const sequelize = require("../database/sequelizeConnection");
const { User, Transaction, Media } = require("../../entities/associateModels");
const { populateTransactions, populateUser } = require("./initialData");

const dbConnection = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: true });

    // Sincronizar modelos con la base de datos
    await User.sync();
    await Transaction.sync();
    await Media.sync();

    // Poblar la base de datos con datos iniciales
    await populateUser();
    await populateTransactions();

    console.log("Database online");
  } catch (error) {
    console.error("There is an error starting database", error);
    throw new Error("There is an error starting database");
  }
};

module.exports = {
  dbConnection,
};

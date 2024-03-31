const {
  createTransaction,
  getTransactions,
  getTransaction,
} = require("../services/transactionService");
const { findUserById } = require("../services/userService");
const { v4: uuidv4 } = require("uuid");

const create = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
    };
    const transactionId = await createTransaction(transactionData);

    res.status(201).json({
      id: transactionId,
      message: "Receta creada con éxito",
    });
  } catch (error) {
    console.error(`Error en la creación de la receta: ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "Ha ocurrido una excepción",
    });
  }
};

const getById = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const response = await getTransaction(transactionId);
    const transaction = response.dataValues;

    res.status(200).json({
      ...transaction,
    });
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has occurred",
    });
  }
};

module.exports = {
  create,
  getById,
};

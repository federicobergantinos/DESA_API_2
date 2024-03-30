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
  console.log(transactions);

  return transactions;
};

const updateTransaction = async (recipeId, updateData) => {
  const {
    title,
    description,
    preparationTime,
    servingCount,
    ingredients,
    steps,
    calories,
    proteins,
    totalFats,
    tags,
    images,
    video,
  } = updateData;

  // Convertir arrays a strings para almacenamiento, si es necesario
  const ingredientsString = ingredients?.join("|");
  const stepsString = steps?.join("|");

  // Iniciar una transacción
  const transaction = await sequelize.transaction();

  try {
    // Actualizar la receta básica
    await Transaction.update(
      {
        title,
        description,
        preparationTime,
        servingCount,
        ingredients: ingredientsString,
        steps: stepsString,
        calories,
        proteins,
        totalFats,
      },
      { where: { id: recipeId } },
      { transaction }
    );

    // Eliminar las asociaciones de tags y medios existentes
    await TransactionTags.destroy({ where: { recipeId }, transaction });
    await Media.destroy({ where: { recipeId }, transaction });

    // Insertar nuevos tags y crear asociaciones
    for (const tagName of tags) {
      let [tag, created] = await Tag.findOrCreate({
        where: { key: tagName },
        transaction,
      });
      await TransactionTags.create(
        { recipeId, tagId: tag.id },
        { transaction }
      );
    }

    // Insertar nuevas imágenes
    for (const url of images) {
      await Media.create(
        { recipeId, data: url, type: "image" },
        { transaction }
      );
    }

    // Insertar nuevo video si se proporciona
    if (video) {
      await Media.create(
        { recipeId, data: video, type: "video" },
        { transaction }
      );
    }

    // Hacer commit de la transacción
    await transaction.commit();
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    throw error;
  }
};

const searchTransactions = async ({ searchTerm, limit, offset }) => {
  const transactions = await Transaction.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { ingredients: { [Op.iLike]: `%${searchTerm}%` } },
      ],
    },
    limit,
    offset,
    include: [
      {
        model: Media,
        as: "media",
        attributes: ["data", "type"], // Asegúrate de que 'data' contiene la URL o referencia de la imagen
        where: { type: "image" },
        limit: 1, // Intenta limitar a 1 el resultado de media directamente en la consulta
      },
    ],
  });

  return transactions.map((transaction) => {
    // Asumiendo que `media` es un array, incluso si limitas los resultados en la consulta
    const firstImage =
      transaction.media.length > 0 ? transaction.media[0].data : null;

    return {
      id: transaction.id,
      title: transaction.title,
      media: firstImage,
      description: transaction.description,
    };
  });
};

const getTransaction = async (recipeId) => {
  const transaction = await Transaction.findByPk(recipeId, {
    include: [
      {
        model: Media,
        as: "media",
        attributes: ["data", "type"],
      },
    ],
  });
  if (transaction === null) {
    throw new NotFound("Transaction not found");
  }

  const recipeTags = await TransactionTags.findAll({
    where: { recipeId },
    attributes: ["tagId"],
  });
  const tagIds = recipeTags.map((recipeTag) => recipeTag.tagId);
  const tags = await Tag.findAll({
    where: { id: tagIds },
    attributes: ["key"],
  });

  transaction.steps = transaction.steps.split("|");
  transaction.ingredients = transaction.ingredients.split("|");
  transaction.dataValues.tags = tags.map((t) => t.key);
  transaction.dataValues.media.sort((a, b) => {
    if (a.type === "image" && b.type === "video") {
      return -1;
    } else if (a.type === "video" && b.type === "image") {
      return 1;
    }
    return 0;
  });

  return transaction.dataValues;
};

const deleteTransactionById = async (recipeId) => {
  await Media.destroy({ where: { recipeId: recipeId } });

  await deleteRatingByTransactionId(recipeId);
  await Transaction.destroy({
    where: {
      id: recipeId,
    },
  });
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  searchTransactions,
  updateTransaction,
  deleteTransactionById,
};

const {
  Media,
  Tag,
  Recipe,
  RecipeTags,
  User,
} = require("../entities/associateModels");
const BadRequest = require("../Errors/BadRequest");
const { isValidUser } = require("./userService");
const NotFound = require("../Errors/NotFound");
const { Op } = require("sequelize");
const sequelize = require("../configurations/database/sequelizeConnection");
const {getRecipeRating, deleteRatingByRecipeId} = require("./ratingService");
const {deleteFavoritesByRecipeId} = require("./favoriteService");

// Función para crear una receta y asociarla con tags y medios
const createRecipe = async (recipeData) => {
  const {
    userId,
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
  } = recipeData;
  // Verificar si el usuario es válido
  if (!(await isValidUser(userId))) {
    throw new BadRequest("Invalid User");
  }

  // Convertir arrays a strings para almacenamiento
  const ingredientsString = ingredients.join("|");
  const stepsString = steps.join("|");

  // Iniciar una transacción
  const transaction = await sequelize.transaction();

  try {
    // Crear la receta
    const recipe = await Recipe.create(
      {
        userId,
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
      { transaction }
    );

    // Insertar cada URL de imagen en la base de datos
    if (images && images.length > 0) {
      const mediaPromises = images.map((url) =>
        Media.create(
          {
            recipeId: recipe.id,
            data: url,
            type: "image",
          },
          { transaction }
        )
      );
      await Promise.all(mediaPromises);
    }

    // Guardar el video en Media si existe
    if (video) {
      await Media.create(
        {
          recipeId: recipe.id,
          data: video,
          type: "video",
        },
        { transaction }
      );
    }

    // Asociar tags si existen
    if (tags && tags.length > 0) {
      const tagsPromises = tags.map(async (tagName) => {
        const tag = await Tag.findOne({
          where: { key: tagName },
        });
        if (tag) {
          await RecipeTags.create(
            {
              recipeId: recipe.id,
              tagId: tag.id,
            },
            { transaction }
          );
        }
      });

      await Promise.all(tagsPromises);
    }

    // Si todo ha ido bien, hacer commit de la transacción
    await transaction.commit();

    return recipe.id;
  } catch (error) {
    // Si hay un error, revertir la transacción
    await transaction.rollback();
    throw error;
  }
};

const getRecipes = async (queryData) => {
  let includeOptions = [
    {
      model: Media,
      as: "media",
      attributes: ["data", "type"],
      where: { type: "image" },
    },
    {
      model: Tag,
      as: "tags",
      through: { attributes: [] },
    },
  ];

  if (queryData.tag) {
    includeOptions.push({
      model: Tag,
      as: "tags",
      where: { key: queryData.tag },
      required: true,
    });
  }

  // Agrega un filtro por userId si se proporciona
  if (queryData.userId) {
    includeOptions.push({
      model: User,
      as: "user",
      where: { id: queryData.userId },
      required: true, // Solo incluye recetas que pertenecen al userId especificado
    });
  }

  const recipes = await Recipe.findAll({
    include: includeOptions,
  });

  const ratingPromise = recipes.map(async it => {
    const rating = await getRecipeRating(it.id);
    return { ...it.toJSON(), rating };
  });

  const updatedRecipes = await Promise.all(ratingPromise);

  updatedRecipes.sort((a, b) => b.rating - a.rating);
  return updatedRecipes.slice(queryData.offset, queryData.offset + queryData.limit);
};

const updateRecipe = async (recipeId, updateData) => {
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
    await Recipe.update(
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
    await RecipeTags.destroy({ where: { recipeId }, transaction });
    await Media.destroy({ where: { recipeId }, transaction });

    // Insertar nuevos tags y crear asociaciones
    for (const tagName of tags) {
      let [tag, created] = await Tag.findOrCreate({
        where: { key: tagName },
        transaction,
      });
      await RecipeTags.create({ recipeId, tagId: tag.id }, { transaction });
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

const searchRecipes = async ({ searchTerm, limit, offset }) => {
  const recipes = await Recipe.findAll({
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

  return recipes.map((recipe) => {
    // Asumiendo que `media` es un array, incluso si limitas los resultados en la consulta
    const firstImage = recipe.media.length > 0 ? recipe.media[0].data : null;

    return {
      id: recipe.id,
      title: recipe.title,
      media: firstImage,
      description: recipe.description,
    };
  });
};

const getRecipe = async (recipeId) => {
  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      {
        model: Media,
        as: "media",
        attributes: ["data", "type"],
      },
    ],
  });
  if (recipe === null) {
    throw new NotFound("Recipe not found");
  }

  const recipeTags = await RecipeTags.findAll({
    where: { recipeId },
    attributes: ["tagId"],
  });
  const tagIds = recipeTags.map((recipeTag) => recipeTag.tagId);
  const tags = await Tag.findAll({
    where: { id: tagIds },
    attributes: ["key"],
  });

  recipe.steps = recipe.steps.split("|");
  recipe.ingredients = recipe.ingredients.split("|");
  recipe.dataValues.tags = tags.map((t) => t.key);
  recipe.dataValues.media.sort((a, b) => {
    if (a.type === "image" && b.type === "video") {
      return -1;
    } else if (a.type === "video" && b.type === "image") {
      return 1;
    }
    return 0;
  });

  return recipe.dataValues;
};

const deleteRecipeById = async (recipeId) => {
  await Media.destroy({ where:{recipeId: recipeId}})

  await deleteFavoritesByRecipeId(recipeId)
  await deleteRatingByRecipeId(recipeId)
  await Recipe.destroy({
    where:
        {
          id: recipeId
        }
  })
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  searchRecipes,
  updateRecipe,
  deleteRecipeById
};

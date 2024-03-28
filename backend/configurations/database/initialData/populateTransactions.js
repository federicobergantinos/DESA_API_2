const {
  Transaction,
  Media,
  Tag,
  TransactionTags,
  User,
} = require("../../../entities/associateModels");
const { recipesData } = require("./recipesData");

const populateTransactions = async () => {
  try {
    for (const recipeData of recipesData) {
      const {
        title,
        description,
        preparationTime,
        servingCount,
        ingredients,
        steps,
        calories,
        totalFats,
        proteins,
        image,
        video,
        tags,
        userId,
      } = recipeData;

      // Buscar el usuario por userId
      const user = await User.findByPk(userId);
      if (!user) {
        console.log(`User with id ${userId} not found.`);
        continue; // Saltar esta receta si el usuario no se encuentra
      }

      // Crear la receta (sin incluir la imagen directamente aquí)
      const recipe = await Transaction.create({
        title,
        description,
        preparationTime,
        servingCount,
        ingredients,
        steps,
        calories,
        totalFats,
        proteins,
        userId: user.id,
      });

      // Crear registro de Media para la imagen y asociarlo con la receta
      const media = await Media.create({
        data: image,
        recipeId: recipe.id, // Asociar el registro de Media con la receta mediante la clave externa
        type: "image",
      });

      // Si se proporciona un video, crear un registro de Media para el video y asociarlo con la receta
      if (video) {
        await Media.create({
          data: video,
          recipeId: recipe.id,
          type: "video",
        });
      }
      // Buscar y asociar etiquetas existentes con la receta
      const tagInstances = await Promise.all(
        tags.map(async (tagName) => {
          // Aquí cambiamos findOrCreate por findOne ya que no queremos crear nuevas etiquetas
          const tagInstance = await Tag.findOne({
            where: { key: tagName },
          });
          return tagInstance;
        })
      );

      // Filtramos cualquier instancia de etiqueta que no se haya encontrado para evitar errores
      const existingTagInstances = tagInstances.filter(
        (tagInstance) => tagInstance !== null
      );

      // Asociar la receta con sus etiquetas existentes
      for (const tagInstance of existingTagInstances) {
        await TransactionTags.create({
          recipeId: recipe.id,
          tagId: tagInstance.id,
        });
      }
    }

    console.log("Transactions table has been populated with initial data.");
  } catch (error) {
    console.error("Error populating Transactions table:", error);
  }
};

module.exports = populateTransactions;

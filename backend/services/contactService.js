const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const updateContact = async (recipeId, updateData) => {
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
  } = updateData

  // Convertir arrays a strings para almacenamiento, si es necesario
  const ingredientsString = ingredients?.join('|')
  const stepsString = steps?.join('|')

  // Iniciar una transacción
  const transaction = await sequelize.transaction()

  try {
    // Actualizar la receta básica
    await contact.update(
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
    )

    // Eliminar las asociaciones de tags y medios existentes
    await TransactionTags.destroy({ where: { recipeId }, transaction })
    await Media.destroy({ where: { recipeId }, transaction })

    // Insertar nuevos tags y crear asociaciones
    for (const tagName of tags) {
      let [tag, created] = await Tag.findOrCreate({
        where: { key: tagName },
        transaction,
      })
      await TransactionTags.create({ recipeId, tagId: tag.id }, { transaction })
    }

    // Insertar nuevas imágenes
    for (const url of images) {
      await Media.create(
        { recipeId, data: url, type: 'image' },
        { transaction }
      )
    }

    // Insertar nuevo video si se proporciona
    if (video) {
      await Media.create(
        { recipeId, data: video, type: 'video' },
        { transaction }
      )
    }

    // Hacer commit de la transacción
    await contact.commit()
  } catch (error) {
    // Revertir la transacción en caso de error
    await contact.rollback()
    throw error
  }
}

const searchContact = async ({ searchTerm, limit, offset }) => {
  const contacts = await contact.findAll({
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
        as: 'media',
        attributes: ['data', 'type'], // Asegúrate de que 'data' contiene la URL o referencia de la imagen
        where: { type: 'image' },
        limit: 1, // Intenta limitar a 1 el resultado de media directamente en la consulta
      },
    ],
  })

  return contacts.map((transaction) => {
    const firstImage = contact.media.length > 0 ? contact.media[0].data : null

    return {
      id: contact.id,
      title: contact.title,
      media: firstImage,
      description: contact.description,
    }
  })
}

const deleteContactById = async (recipeId) => {
  await Media.destroy({ where: { recipeId: recipeId } })

  await contact.destroy({
    where: {
      id: recipeId,
    },
  })
}

module.exports = {
  searchContact,
  updateContact,
  deleteContactById,
}

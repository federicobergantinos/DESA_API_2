const createLogger = require('../configurations/Logger')
const { Contact, User } = require('../entities/associateModels')
const logger = createLogger(__filename)
const sequelize = require('../configurations/database/sequelizeConnection')
const { NotFound, BadRequest } = require('http-errors')
const { Op } = require('sequelize')

const updateContact = async (contactId, updateData) => {
  const { name, accountNumber, accountType, userId } = updateData

  try {
    // Proceder con la actualización del contacto
    const result = await sequelize.transaction(async (t) => {
      const contact = await Contact.findByPk(contactId)
      if (!contact) {
        throw new NotFound(`Contact with ID ${contactId} not found`)
      }

      // Forzar el parseo de userId a numérico
      const numericUserId = parseInt(userId, 10)
      const numericContactUserId = parseInt(contact.userId, 10)

      // Verificar si el contacto pertenece al usuario
      if (numericContactUserId !== numericUserId) {
        throw new BadRequest(
          `Contact with ID ${contactId} does not belong to user with ID ${userId}`
        )
      }

      await Contact.update(
        { name, accountNumber, accountType },
        { where: { id: contactId }, transaction: t }
      )
    })

    return result
  } catch (error) {
    throw error
  }
}

const searchContact = async ({ searchTerm, limit, offset, userId }) => {
  let includeOptions = [
    {
      model: User,
      as: 'user',
      required: true,
      attributes: ['name', 'surname'],
    },
  ]

  const contacts = await Contact.findAll({
    where: {
      [Op.or]: [{ name: { [Op.iLike]: `%${searchTerm}%` } }],
      userId: userId,
    },
    include: includeOptions,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: ['name', 'accountType', 'id'],
  })

  return contacts
}

const deleteContactById = async (contactId) => {
  await Contact.destroy({
    where: {
      id: contactId,
    },
  })
}

const createContact = async (contactData) => {
  try {
    const newContact = await Contact.create(contactData)

    return newContact.id
  } catch (error) {
    throw error
  }
}

const getContacts = async (queryData) => {
  const userId = parseInt(queryData.userId, 10)
  const limit = queryData.limit || 20
  const offset = queryData.offset || 0

  let includeOptions = [
    {
      model: User,
      as: 'user',
      required: true,
      attributes: ['name', 'surname'],
    },
  ]

  const contacts = await Contact.findAll({
    where: { userId: userId },
    include: includeOptions,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: ['name', 'accountType', 'id'],
  })

  return contacts
}

const getContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId)
  if (contact === null) {
    throw new NotFound('Contact not found')
  }

  return contact
}

module.exports = {
  searchContact,
  updateContact,
  deleteContactById,
  createContact,
  getContacts,
  getContact,
}

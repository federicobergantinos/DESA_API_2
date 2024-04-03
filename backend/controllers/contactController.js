const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  searchContact,
  deleteContactById,
} = require('../services/contactService')
const { findUserById } = require('../services/userService')
const { v4: uuidv4 } = require('uuid')
const { sendResponse } = require('../configurations/utils.js')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const create = async (req, res) => {
  try {
    const contactData = {
      ...req.body,
    }
    const contactId = await createContact(contactData)

    return sendResponse(res, 201, {
      contactId: contactId,
      message: 'The contact was succefully created',
    })
  } catch (error) {
    logger.error(`Error to create the contact: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 0 // Asegúrate de proporcionar un valor por defecto
  const limit = parseInt(req.query.limit) || 20 // Límite de ítems por página
  const offset = page * limit
  const userId = req.query.userId

  try {
    const response = await getContacts({ limit, offset, userId })

    return sendResponse(res, 200, response)
  } catch (error) {
    logger.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const searchAll = async (req, res) => {
  const searchTerm = req.query.searchTerm || ''
  const userId = req.query.userId || ''
  const page = parseInt(req.query.page) || 0
  const limit = parseInt(req.query.limit) || 50
  const offset = page * limit

  try {
    const contact = await searchContact({
      searchTerm,
      limit,
      offset,
      userId,
    })
    return sendResponse(res, 200, { contact })
  } catch (error) {
    logger.error(`searchContact: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: 'An exception has occurred',
    })
  }
}

const getById = async (req, res) => {
  try {
    const contactId = req.params.contactId
    const response = await getContact(contactId)
    const contact = response.dataValues
    console.log(response)
    console.log(contact)

    return sendResponse(res, 200, {
      id: contact.id,
      name: contact.name,
      accountNumber: contact.accountNumber,
      accountType: contact.accountType,
      userId: contact.userId,
    })
  } catch (error) {
    logger.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const update = async (req, res) => {
  try {
    const { contactId } = req.params
    const updateData = {
      ...req.body,
    }
    await updateContact(contactId, updateData)

    return sendResponse(res, 200, {
      message: 'The contact was succefully updated',
    })
  } catch (error) {
    logger.error(`Error to update the contact: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params
    deleteContactById(contactId)

    return sendResponse(res, 204, {})
  } catch (error) {
    logger.error(`Error to delete the contact: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'Error to update the contact.',
    })
  }
}

module.exports = {
  create,
  getAll,
  getById,
  searchAll,
  update,
  deleteContact,
}

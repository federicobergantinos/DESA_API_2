const {
  updateUserProfile,
  findUserById,
  deactivateUserService,
} = require('../services/userService')
const { deactivateAccountsByUserId } = require('../services/accountService')
const { sendResponse } = require('../configurations/utils.js')
const createLogger = require('../configurations/Logger')
const logger = createLogger(__filename)

const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})
const s3 = new AWS.S3()

const uploadBase64ImageToS3 = async (base64Image, prefix, filename) => {
  if (typeof base64Image !== 'string') {
    throw new TypeError('El argumento base64Image debe ser una cadena')
  }

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  const contentType =
    base64Image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg'

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${prefix}/${Date.now()}_${filename}`,
    Body: buffer,
    ContentType: contentType,
    // ACL: 'public-read',
  }

  try {
    const s3Response = await s3.upload(params).promise()
    return s3Response.Location // Retorna la URL del archivo cargado
  } catch (error) {
    console.error('Error al cargar la imagen a S3:', error)
    throw error
  }
}

const getUser = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await findUserById(userId)
    return sendResponse(res, 200, { user })
  } catch (error) {
    console.error(`${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has ocurred',
    })
  }
}

const editProfile = async (req, res) => {
  try {
    const userId = req.params.userId
    const updateData = {}
    // Recoger solo los campos que necesitamos actualizar
    const { name, surname, photoUrl } = req.body
    if (name !== undefined) updateData.name = name
    if (surname !== undefined) updateData.surname = surname
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl

    const updatedUser = await updateUserProfile(userId, updateData)
    if (updatedUser) {
      return sendResponse(res, 200, { user: updatedUser })
    } else {
      // Este bloque else podría no ser necesario dado que ahora lanzamos un error si el usuario no se encuentra
      return sendResponse(res, 404, { msg: 'User not found' })
    }
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, {
      msg: 'An exception has occurred',
    })
  }
}

const deactivateUser = async (req, res) => {
  try {
    const userId = req.params.userId
    if (!userId) {
      throw new Error('User ID is undefined')
    }

    // Desactiva las cuentas del usuario
    await deactivateAccountsByUserId(userId)

    // Desactiva al usuario
    await deactivateUserService(userId)

    return sendResponse(res, 200, { message: 'User desactivated successfully' })
  } catch (error) {
    console.error(`Error deleting user: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const uploadImage = async (req, res) => {
  const { image, prefix, filename } = req.body
  try {
    const imageUrl = await uploadBase64ImageToS3(image, prefix, filename)

    return sendResponse(res, 200, {
      message: 'Imagen subida con éxito',
      response: imageUrl,
    })
  } catch (error) {
    console.error(`Hubo un problema al subir la imagen: ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'Ha ocurrido un error al subir la imagen',
    })
  }
}

module.exports = {
  getUser,
  editProfile,
  uploadImage,
  deactivateUser,
}

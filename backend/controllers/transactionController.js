const {
  createTransaction,
  getTransactions,
  getTransaction,
} = require("../services/transactionService");
const { findUserById } = require("../services/userService");
const { v4: uuidv4 } = require("uuid");

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

const uploadBase64ImageToS3 = async (base64Image, filename) => {
  // Asegúrate de que base64Image es una cadena
  if (typeof base64Image !== "string") {
    throw new TypeError("El argumento base64Image debe ser una cadena");
  }

  // Corrige la expresión regular para eliminar correctamente el prefijo de la cadena base64
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Asignar un tipo de contenido correcto o asumir jpeg como predeterminado
  const contentType =
    base64Image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${filename}`,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    const s3Response = await s3.upload(params).promise();
    return s3Response.Location; // Retorna la URL del archivo cargado
  } catch (error) {
    console.error("Error al cargar la imagen a S3:", error);
    throw error;
  }
};

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

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Asegúrate de proporcionar un valor por defecto
  const limit = parseInt(req.query.limit) || 20; // Límite de ítems por página
  const offset = page * limit;
  const userId = req.query.userId;

  try {
    const response = await getTransactions({ limit, offset, userId });

    res.status(200).json(response);
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has occurred",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = transaction.userId;
    console.log(req.params);
    const transaction = await getTransaction(transactionId);
    console.log(transaction);
    const user = await findUserById(userId);

    res.status(200).json({
      ...transaction,
      username: user.name + " " + user.surname,
      userImage: user.photoUrl,
      media: images,
      video: videos,
      rating: rating,
    });
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has occurred",
    });
  }
};

const uploadImage = async (req, res) => {
  const image = req.body.image;
  try {
    const filename = `${uuidv4()}.jpeg`; // Asegurar un nombre de archivo único
    const imageUrl = await uploadBase64ImageToS3(image, filename); // Subir y obtener la URL

    res.status(200).json({
      message: "Imagen subida con éxito",
      images: imageUrl,
    });
  } catch (error) {
    console.error(`Hubo un problema al subir la imagen: ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "Ha ocurrido un error al actualizar la receta",
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  uploadImage,
};

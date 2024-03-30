const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  searchContacts,
  deleteContactById,
} = require("../services/contactService");
const { findUserById } = require("../services/userService");
const { v4: uuidv4 } = require("uuid");

const create = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
    };
    const transactionId = await createContact(transactionData);

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
    const response = await getContacts({ limit, offset, userId });

    res.status(200).json(response);
  } catch (error) {
    console.error(` ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "An exception has occurred",
    });
  }
};

const searchAll = async (req, res) => {
  const searchTerm = req.query.searchTerm || "";
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const offset = page * limit;

  try {
    const transactions = await searchContacts({
      searchTerm,
      limit,
      offset,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(`searchContacts: ${error}`);
    res.status(500).json({
      msg: "An exception has occurred",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.query.userId;
    const transaction = await getContact(transactionId);
    const user = await findUserById(transaction.userId);

    // Se filtran los elementos de media según su tipo y se agregan a los atributos correspondientes.
    const images = transaction.media
      .filter((m) => m.type === "image")
      .map((m) => m.data);
    const videos = transaction.media
      .filter((m) => m.type === "video")
      .map((m) => m.data)[0];

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

const update = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const updateData = {
      ...req.body,
    };
    await updateContact(transactionId, updateData);

    res.status(200).json({
      message: "Receta actualizada con éxito",
      images: req.body.images, // Devolver las URLs de las imágenes proporcionadas
    });
  } catch (error) {
    console.error(`Error al actualizar la receta: ${error}`);
    res.status(error.code || 500).json({
      msg: error.message || "Ha ocurrido una excepción",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    deleteContactById(req.params.transactionId);

    res.status(204).send();
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
  searchAll,
  update,
  deleteContact,
};

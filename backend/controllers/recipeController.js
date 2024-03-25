const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  searchRecipes, deleteRecipeById,
} = require("../services/recipeService");
const { findUserById } = require("../services/userService");
const { isFavorite } = require("../services/favoriteService");
const { v4: uuidv4 } = require("uuid");
const { getRecipeRating } = require("../services/ratingService");

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
    const recipeData = {
      ...req.body,
    };
    const recipeId = await createRecipe(recipeData);

    res.status(201).json({
      id: recipeId,
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
  const tag = req.query.tag;
  const userId = req.query.userId;

  try {
    const recipes = await getRecipes({ limit, offset, tag, userId });
    const response = recipes.map((recipe) => {
      const { id, title, media, tags, rating } = recipe;
      const filteredMedia = media.filter((m) => m.type === "image");
      const firstImage = filteredMedia.length > 0 ? filteredMedia[0].data : "";

      const tagsArray = tags.map((tag) => tag.key);

      return {
        id,
        title,
        media: firstImage,
        tags: tagsArray,
        rating: rating,
      };
    });
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
    const recipes = await searchRecipes({ searchTerm, limit, offset });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(`searchRecipes: ${error}`);
    res.status(500).json({
      msg: "An exception has occurred",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.query.userId;
    const recipe = await getRecipe(recipeId);
    const user = await findUserById(recipe.userId);
    const isValidFavorite = await isFavorite(userId, recipeId);

    // Se filtran los elementos de media según su tipo y se agregan a los atributos correspondientes.
    const images = recipe.media
      .filter((m) => m.type === "image")
      .map((m) => m.data);
    const videos = recipe.media
      .filter((m) => m.type === "video")
      .map((m) => m.data)[0];

    const rating = await getRecipeRating(recipeId);

    res.status(200).json({
      ...recipe,
      username: user.name + " " + user.surname,
      userImage: user.photoUrl,
      media: images,
      video: videos,
      isFavorite: isValidFavorite,
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
    const { recipeId } = req.params;
    const updateData = {
      ...req.body,
    };
    await updateRecipe(recipeId, updateData);

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

const deleteRecipe = async (req, res) => {
  try {

    deleteRecipeById(req.params.recipeId)

    res.status(204).send()
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
  uploadImage,
  deleteRecipe
};

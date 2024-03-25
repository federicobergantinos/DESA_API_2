const { Tag } = require("../../../entities/associateModels");

const populateTags = async () => {
  const tags = [
    { title: "All", key: "ALL" },
    { title: "Vegetariana", key: "VEGETARIAN" },
    { title: "Rapida Preparacion", key: "RAPID_PREPARATION" },
    { title: "Vegana", key: "VEGAN" },
    { title: "Aptas celiacas", key: "GLUTEN_FREE" },
    { title: "Sistema inmune", key: "IMMUNE_SYSTEM" },
    { title: "Flora intestinal", key: "INTESTINAL_FLORA" },
    { title: "Antiinflamatoria", key: "ANTI_INFLAMMATORY" },
    { title: "Baja en carbohidratos", key: "LOW_CARB" },
    { title: "Baja en sodio", key: "LOW_SODIUM" },
  ];

  try {
    const tagsExist = await Tag.count();
    if (tagsExist === 0) {
      await Tag.bulkCreate(tags);
      console.log("Tags table has been populated with initial data.");
    } else {
      console.log("Tags table is already populated.");
    }
  } catch (error) {
    console.error("Error populating Tags table:", error);
  }
};

module.exports = populateTags;
